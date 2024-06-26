import config from "config";
import Redis from "ioredis";
import { IMailgunClient } from "mailgun.js/Interfaces";
import { v4 as uuidv4 } from "uuid";

import { Inject, Injectable } from "@nestjs/common";

import { ServiceException } from "../lib/exceptions/service-exception";
import { decodeInviteCode } from "../lib/generate-id/generate-user-id";
import { KeycloakService } from "../lib/keycloak/keycloak.service";
import { MailService } from "../lib/mailgun/mailgun.service";
import { PrismaService } from "../lib/prisma/prisma.service";
import { generateUsername } from "../lib/utils/extract-username-from-email";
import { encodePaymentPassword } from "../user/utils/paymentPassword";

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

  async sendResetPasswordEmail(email: string) {
    const user = await this.keycloakService.findUserByEmail(email);

    if (!user) {
      throw new ServiceException("user not found", "USER_NOT_FOUND");
    }
    const redisKey = `piday::forgot_password.${user.email}`;
    // Get existing verification code
    let verificationCode = await this.redis.get(redisKey);
    if (!verificationCode) {
      verificationCode = uuidv4();

      this.redis.set(redisKey, verificationCode);
      this.redis.expire(redisKey, 60 * 30);
    }

    try {
      console.log({
        name: user.username,
        action_url: `${process.env.FRONTEND_URL}/auth/reset-password?email=${user.email}&code=${verificationCode}`,
        verification_code: verificationCode,
      });
      await this.mailService.sendTemplateEmail({
        to: user.email,
        subject: `Reset Password`,
        template: "x2p0347x96kgzdrn",
        variables: {
          name: user.username,
          action_url: `${config.get("frontend.url")}/auth/reset-password?email=${user.email}&code=${verificationCode}`,
          verification_code: verificationCode,
        },
      });
    } catch (error) {
      console.error("Send email failed:", error);
      throw new ServiceException("Send email failed", "SEND_EMAIL_FAILED");
    }
  }

  async resetAccountPassword(
    newPassword: string,
    confirmPassword: string,
    email: string,
    code: string,
  ) {
    const redisKey = `piday::forgot_password.${email}`;
    // Get exisint verification code
    const verificationCode = await this.redis.get(redisKey);
    if (verificationCode !== code) {
      throw new ServiceException(
        "Invalid verification code",
        "INVALID_VERIFICATION_CODE",
      );
    }
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new ServiceException("user not found", "USER_NOT_FOUND");
    }

    if (user.piUid) {
      throw new ServiceException("Not Valid user", "NOT_VALID_USER");
    }

    if (confirmPassword !== newPassword) {
      throw new ServiceException(
        "passwords do not match",
        "PASSWORD_DO_NOT_MATCH",
      );
    }
    const passwordUpdated = await this.keycloakService.updateAccountPassword(
      user.keycloakID,
      newPassword,
    );

    if (passwordUpdated) {
      this.redis.expire(redisKey, 0);
      return passwordUpdated;
    } else {
      return false;
    }
  }

  async sendResetPaymentPasswordEmail(email: string) {
    const user = await this.keycloakService.findUserByEmail(email);

    if (!user) {
      throw new ServiceException("user not found", "USER_NOT_FOUND");
    }
    const redisKey = `piday::forgot_payment_password.${user.email}`;
    // Get existing verification code
    let verificationCode = await this.redis.get(redisKey);
    if (!verificationCode) {
      verificationCode = uuidv4();

      this.redis.set(redisKey, verificationCode);
      this.redis.expire(redisKey, 60 * 30);
    }

    try {
      console.log({
        name: user.username,
        action_url: `${process.env.FRONTEND_URL}/auth/reset-payment-password?email=${user.email}&code=${verificationCode}`,
        verification_code: verificationCode,
      });
      await this.mailService.sendTemplateEmail({
        to: user.email,
        subject: `Reset Payment Password`,
        template: "v69oxl51w6k4785k",
        variables: {
          name: user.username,
          action_url: `${config.get("frontend.url")}/auth/reset-payment-password?email=${user.email}&code=${verificationCode}`,
          verification_code: verificationCode,
        },
      });
    } catch (error) {
      console.error("Send email failed:", error);
      throw new ServiceException("Send email failed", "SEND_EMAIL_FAILED");
    }
  }
  async updatePaymentPassword({
    code,
    email,
    newPassword,
    confirmPassword,
  }: {
    code: string;
    email: string;
    newPassword: string;
    confirmPassword: string;
  }) {
    const redisKey = `piday::forgot_payment_password.${email}`;
    // Get exisint verification code
    const verificationCode = await this.redis.get(redisKey);
    if (verificationCode !== code) {
      throw new ServiceException(
        "Invalid verification code",
        "INVALID_VERIFICATION_CODE",
      );
    }
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new ServiceException("user not found", "USER_NOT_FOUND");
    }
    if (confirmPassword !== newPassword) {
      throw new ServiceException(
        "passwords do not match",
        "PASSWORD_DO_NOT_MATCH",
      );
    }
    const passwordHash = encodePaymentPassword(newPassword);

    const passwordUpdated = await this.prisma.user.update({
      data: {
        paymentPassword: passwordHash,
      },
      where: {
        keycloakID: user.keycloakID,
      },
    });
    if (passwordUpdated) {
      this.redis.expire(redisKey, 0);
      return true;
    } else {
      return false;
    }
  }
}
