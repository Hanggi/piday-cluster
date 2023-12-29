import config from "config";
import Redis from "ioredis";
import { IMailgunClient } from "mailgun.js/Interfaces";

import { Inject, Injectable } from "@nestjs/common";

import { ServiceException } from "../lib/exceptions/service-exception";
import { KeycloakService } from "../lib/keycloak/keycloak.service";
import { PrismaService } from "../lib/prisma/prisma.service";
import { generateUsername } from "../lib/utils/extract-username-from-email";

@Injectable()
export class AuthService {
  constructor(
    @Inject("REDIS_CLIENT") readonly redis: Redis,
    @Inject("MAILGUN_CLIENT") readonly mailgun: IMailgunClient,
    private readonly keycloakService: KeycloakService,
    private prisma: PrismaService,
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

    // TODO: Make mail service
    // Send email
    const mg = this.mailgun;

    const mailgunData = {
      from: "services@piday.world",
      to: email,
      subject: `Email Verification`,
      template: "email-verification",
      "h:X-Mailgun-Variables": JSON.stringify({
        // be sure to stringify your payload
        verification_code: verificationCode,
      }),
      "h:Reply-To": "reply-to@example.com",
    };

    try {
      await mg.messages.create(
        config?.get<string>("mailgun.domain"),
        mailgunData,
      );
    } catch (error) {
      console.error("Send email failed:", error);
      throw new ServiceException("Send email failed", "SEND_EMAIL_FAILED");
    }
  }

  async emailSignup(email: string, code: string, password: string) {
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

    await this.prisma.user.create({
      data: {
        email,
        username: randomUserName,
        keycloakID: createdUser.id,
      },
    });

    return createdUser;
  }
}
