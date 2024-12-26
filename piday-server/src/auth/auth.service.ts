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

  /*****************************************************************************
   * Pi Wallet Integration
   ****************************************************************************/

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

  /*****************************************************************************
   * Security & Password Reset
   ****************************************************************************/

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

  async sendMigrateToEmailAccountEmail(userID: string, email: string) {
    const user = await this.keycloakService.findUserByUserID(userID);

    if (!user) {
      throw new ServiceException("user not found", "USER_NOT_FOUND");
    }

    const redisKey = `piday::migrate_to_email_account.${userID}.${email}`;
    // Get existing verification code
    let verificationCode = await this.redis.get(redisKey);
    if (!verificationCode) {
      verificationCode = uuidv4();

      this.redis.set(redisKey, verificationCode);
      this.redis.expire(redisKey, 60 * 30);
    }

    const actionURL = `${process.env.FRONTEND_URL}/auth/migrate-to-email-account?userID=${userID}&email=${email}&code=${verificationCode}`;

    try {
      console.log({
        name: user.username,
        action_url: actionURL,
        verification_code: verificationCode,
      });
      await this.mailService.sendEmail({
        to: email,
        subject: "Account Migration Notice | 账户迁移通知",
        html: `<p>亲爱的用户：</p>
     <p>您好！</p>
     <p>通过点击下面的链接，您可以将当前的 Pi 账户迁移到您的邮箱账户。</p>
     <p>Dear User,</p>
     <p>Greetings!</p>
     <p>By clicking the link below, you can migrate your current Pi account to your email account.</p>
     <a href="${actionURL}">${actionURL}</a>`,
        text: `亲爱的用户：
 您好！
 通过点击下面的链接，您可以将当前的 Pi 账户迁移到您的邮箱账户。
 Dear User,
 Greetings!
 By clicking the link below, you can migrate your current Pi account to your email account.
 ${actionURL}`,
      });
    } catch (error) {
      console.error("Send email failed:", error);
      throw new ServiceException("Send email failed", "SEND_EMAIL_FAILED");
    }
  }

  async migrateToEmailAccount({
    code,
    email,
    userID,
  }: {
    code: string;
    email: string;
    userID: string;
  }) {
    const redisKey = `piday::migrate_to_email_account.${userID}.${email}`;
    // Get existing verification code
    const verificationCode = await this.redis.get(redisKey);
    if (verificationCode !== code) {
      throw new ServiceException(
        "Invalid verification code of migrate to email account",
        "INVALID_VERIFICATION_CODE",
      );
    }

    const piUser = await this.prisma.user.findUnique({
      where: {
        keycloakID: userID,
      },
    });

    if (!piUser) {
      throw new ServiceException("user not found", "USER_NOT_FOUND");
    }

    if (piUser && piUser.email) {
      throw new ServiceException(
        "Email already binded to Pi Account",
        "EMAIL_EXISTS",
      );
    }

    // Check whether the email is already in use
    const existingEmailUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingEmailUser) {
      // Archive the existing pi account user
      const piUid = piUser.piUid;

      const res = await this.prisma.$transaction([
        this.prisma.user.update({
          data: {
            piUid: piUid + "_archived",
          },
          where: {
            id: piUser.id,
          },
        }),

        this.prisma.user.update({
          data: {
            piUid: piUid,
          },
          where: {
            id: existingEmailUser.id,
          },
        }),
      ]);
      if (res) {
        this.redis.expire(redisKey, 0);
        return true;
      } else {
        return false;
      }
    } else {
      // Bind the email to pi account
      const updatedUser = await this.prisma.user.update({
        data: {
          email,
        },
        where: {
          keycloakID: userID,
        },
      });

      if (updatedUser) {
        this.redis.expire(redisKey, 0);
        return true;
      } else {
        return false;
      }
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
