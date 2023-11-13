import config from "config";
import Redis from "ioredis";
import { IMailgunClient } from "mailgun.js/Interfaces";

import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class AuthService {
  constructor(
    @Inject("REDIS_CLIENT") readonly redis: Redis,
    @Inject("MAILGUN_CLIENT") readonly mailgun: IMailgunClient,
  ) {}

  async setVerificationCodeAndSendEmail(email: string) {
    const redisKey = `piday::auth:email.verify1.${email}`;
    // Get exisint verification code
    let verificationCode = await this.redis.get(redisKey);
    if (!verificationCode) {
      verificationCode = Math.floor(Math.random() * 1000000).toString();

      this.redis.set(redisKey, verificationCode);
      this.redis.expire(redisKey, 60 * 30);
    }

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
    }
  }
}
