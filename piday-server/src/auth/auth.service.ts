import config from "config";
import Redis from "ioredis";
import { IMailgunClient } from "mailgun.js/Interfaces";

import { Inject, Injectable } from "@nestjs/common";

import { ServiceException } from "../lib/exceptions/service-exception";
import { decodeInviteCode } from "../lib/generate-id/generate-user-id";
import { KeycloakService } from "../lib/keycloak/keycloak.service";
import { MailService } from "../lib/mailgun/mailgun.service";
import { PrismaService } from "../lib/prisma/prisma.service";
import { generateUsername } from "../lib/utils/extract-username-from-email";

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

    const databaseUser = await this.prisma.user.create({
      data: {
        email,
        username: randomUserName,
        keycloakID: createdUser.id,
      },
    });

    const inviteCodeExists = await this.redis.exists(inviteCode);
    const initializationVector = await this.redis.get(inviteCode);

    if (inviteCodeExists) {
      const inviteeUserId = parseInt(
        decodeInviteCode(inviteCode, initializationVector),
      );

      const invitee = await this.prisma.user.findUnique({
        where: {
          id: inviteeUserId,
        },
      });

      if (invitee) {
        await this.prisma.user.update({
          data: {
            inviteeID: invitee.id,
          },
          where: {
            id: databaseUser.id,
          },
        });
      }

      await this.redis.del(inviteCode);
    }
    return createdUser;
  }
}
