import { Response } from "express";

import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
  Res,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";

import { AuthService } from "./auth.service";
import { EmailQueryDto } from "./dto/email-query.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get("send-email-verification")
  @Throttle({ default: { limit: 2, ttl: 60000 } })
  async sendEmailVerification(
    @Query() { email }: EmailQueryDto,
    @Res() res: Response,
  ) {
    try {
      await this.authService.setVerificationCodeAndSendEmail(email);
    } catch (err) {
      switch (err.code) {
        case "EMAIL_ALREADY_EXISTS":
          throw new HttpException(
            "Email already verified",
            HttpStatus.CONFLICT,
          );
      }
      throw new HttpException(
        "Internal Server Error",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    res.status(HttpStatus.OK).json({
      message: "Email verification sent",
    });
  }
}
