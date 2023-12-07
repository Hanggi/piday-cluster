import { Response } from "express";

import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Res,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";

import { AuthService } from "./auth.service";
import { EmailQueryDto, EmailSignupDto } from "./dto/email-query.dto";

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
      console.error(err);
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

  @Post("email-signup")
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async emailSignup(
    @Body() { email, code, password }: EmailSignupDto,
    @Res() res: Response,
  ) {
    try {
      await this.authService.emailSignup(email, code, password);
    } catch (err) {
      console.error(err);
      switch (err.code) {
        case "EMAIL_ALREADY_EXISTS":
          throw new HttpException(
            "Email already verified",
            HttpStatus.CONFLICT,
          );
        case "INVALID_VERIFICATION_CODE":
          throw new HttpException(
            "Invalid verification code",
            HttpStatus.BAD_REQUEST,
          );
      }
      throw new HttpException(
        "Internal Server Error",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    res.status(HttpStatus.CREATED).json({
      message: "Email signup success",
    });
  }
}
