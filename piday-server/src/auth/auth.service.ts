import Redis from "ioredis";
import { IMailgunClient } from "mailgun.js/Interfaces";

import { Inject, Injectable } from "@nestjs/common";

import { ServiceException } from "../lib/exceptions/service-exception";
import { decodeInviteCode } from "../lib/generate-id/generate-user-id";
import { KeycloakService } from "../lib/keycloak/keycloak.service";
import { MailService } from "../lib/mailgun/mailgun.service";
import { PrismaService } from "../lib/prisma/prisma.service";
import { generateUsername } from "../lib/utils/extract-username-from-email";
import {
  comparePaymentPassword,
  encodePaymentPassword,
} from "./utils/paymentPassword";

@Injectable()
export class AuthService {
  constructor(
    @Inject("REDIS_CLIENT") readonly redis: Redis,
    @Inject("MAILGUN_CLIENT") readonly mailgun: IMailgunClient,
    private readonly keycloakService: KeycloakService,
    private prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async setVerificationCodeAndSendEmail(email: string) {
    const user = await this.keycloakService.findUserByEmail(email);

    if (user && user.emailVerified) {
      const prismaUser = await this.prisma.user.findUnique({
        where: {
          keycloakID: user.id,
        },
      });

      if (!prismaUser) {
        await this.prisma.user.create({
          data: {
            email,
            username: generateUsername(email),
            keycloakID: user.id,
          },
        });
      }

      throw new ServiceException(
        "Email already verified!",
        "EMAIL_ALREADY_EXISTS",
      );
    }

    const redisKey = `piday::auth:email.verify.${email}`;
    // Get exisint verification code
    let verificationCode = await this.redis.get(redisKey);
    if (!verificationCode) {
      verificationCode = Math.floor(Math.random() * 900000 + 100000).toString();

      this.redis.set(redisKey, verificationCode);
      this.redis.expire(redisKey, 60 * 30);
    }

    try {
      await this.mailService.sendTemplateEmail({
        to: email,
        subject: `Email Verification`,
        template: "jpzkmgqz011g059v",
        variables: {
          verification_code: verificationCode,
        },
      });
    } catch (error) {
      console.error("Send email failed:", error);
      throw new ServiceException("Send email failed", "SEND_EMAIL_FAILED");
    }
  }

  async emailSignup(
    email: string,
    code: string,
    password: string,
    inviteCode: string,
  ) {
    const redisKey = `piday::auth:email.verify.${email}`;
    const verificationCode = await this.redis.get(redisKey);

    if (verificationCode !== code) {
      throw new ServiceException(
        "Invalid verification code",
        "INVALID_VERIFICATION_CODE",
      );
    }

    const user = await this.keycloakService.findUserByEmail(email);

    if (user) {
      throw new ServiceException("Email already exists", "EMAIL_EXISTS");
    }

    let inviterUserID: number | undefined;
    try {
      inviterUserID = decodeInviteCode(inviteCode.trim());
    } catch (err) {
      console.error("Invalid invite code", { inviteCode });
      throw new ServiceException("Invalid invite code", "INVALID_INVITE_CODE");
    }
    if (!inviterUserID) {
      console.error("Invalid invite code", { inviteCode });
      throw new ServiceException("Invalid invite code", "INVALID_INVITE_CODE");
    }

    const inviter = await this.prisma.user.findUnique({
      where: {
        id: inviterUserID,
      },
    });
    if (!inviter) {
      throw new ServiceException("Inviter not found", "INVITER_NOT_FOUND");
    }

    const randomUserName = generateUsername(email);

    const createdUser = await this.keycloakService.createUser({
      email,
      emailVerified: true,
      enabled: true,
      username: randomUserName,
      firstName: randomUserName,
      credentials: [
        {
          type: "password",
          value: password,
          temporary: false,
        },
      ],
    });

    const myUser = await this.prisma.user.create({
      data: {
        email,
        username: randomUserName,
        keycloakID: createdUser.id,
      },
    });

    if (inviter) {
      await this.prisma.user.update({
        data: {
          inviterID: inviter.id,
        },
        where: {
          id: myUser.id,
        },
      });
    }

    return createdUser;
  }

  // Pi Sign In
  async findUserByPiID(piUid: string) {
    return this.prisma.user.findUnique({
      where: {
        piUid,
      },
    });
  }

  async piSignUp({
    username,
    password,
    inviteCode,
    piUid,
  }: {
    username: string;
    password: string;
    inviteCode: string;
    piUid: string;
  }) {
    const piUsername = "pi_" + username;

    // Find inviter user
    let inviterUserID: number | undefined;
    try {
      inviterUserID = decodeInviteCode(inviteCode.trim());
    } catch (err) {
      console.error("Invalid invite code", { inviteCode });
      throw new ServiceException("Invalid invite code", "INVALID_INVITE_CODE");
    }
    if (!inviterUserID) {
      console.error("Invalid invite code", { inviteCode });
      throw new ServiceException("Invalid invite code", "INVALID_INVITE_CODE");
    }
    const inviter = await this.prisma.user.findUnique({
      where: {
        id: inviterUserID,
      },
    });
    if (!inviter) {
      throw new ServiceException("Inviter not found", "INVITER_NOT_FOUND");
    }

    const createdUser = await this.keycloakService.createUser({
      emailVerified: true,
      enabled: true,
      username: piUsername,
      lastName: username,
      firstName: "pi",
      credentials: [
        {
          type: "password",
          value: password,
          temporary: false,
        },
      ],
    });

    const myUser = await this.prisma.user.create({
      data: {
        username: piUsername,
        keycloakID: createdUser.id,
        piUid,
      },
    });

    if (inviter) {
      await this.prisma.user.update({
        data: {
          inviterID: inviter.id,
        },
        where: {
          id: myUser.id,
        },
      });
    }

    return createdUser;
  }

  // Set payment password
  async setPaymentPassword({
    userID,
    password,
  }: {
    userID: string;
    password: string;
  }) {
    const user = await this.prisma.user.findUnique({
      where: {
        keycloakID: userID,
      },
    });
    if (!user) {
      throw new ServiceException("User not found", "USER_NOT_FOUND");
    }

    if (user.paymentPassword) {
      throw new ServiceException(
        "Payment password already set",
        "PAYMENT_PASSWORD_ALREADY_SET",
      );
    }

    const passwordHash = encodePaymentPassword(password);

    await this.prisma.user.update({
      data: {
        paymentPassword: passwordHash,
      },
      where: {
        keycloakID: userID,
      },
    });
  }

  async checkPaymentPassword({
    userID,
    password,
  }: {
    userID: string;
    password: string;
  }) {
    const user = await this.prisma.user.findUnique({
      where: {
        keycloakID: userID,
      },
    });
    if (!user) {
      throw new ServiceException("User not found", "USER_NOT_FOUND");
    }

    if (!user.paymentPassword) {
      throw new ServiceException(
        "Payment password not set",
        "PAYMENT_PASSWORD_NOT_SET",
      );
    }

    const isMatch = comparePaymentPassword(password, user.paymentPassword);
    if (!isMatch) {
      throw new ServiceException(
        "Invalid payment password",
        "INVALID_PASSWORD",
      );
    }
  }
}
