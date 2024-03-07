import axios from "axios";
import config from "config";
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
import { generatePasswordFromPiUid } from "./utils/generatePiUidPass";

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
    @Body() { email, code, password, inviteCode }: EmailSignupDto,
    @Res() res: Response,
  ) {
    if (!inviteCode) {
      throw new HttpException(
        "Invite code is required",
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      await this.authService.emailSignup(email, code, password, inviteCode);
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

  @Post("pi-sign-in")
  async piSignIn(
    @Body()
    { accessToken, inviteCode }: { accessToken: string; inviteCode: string },
  ) {
    let myPiUser: { username: string; uid: string };

    try {
      const me = await axios.get("https://api.minepi.com/v2/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log(me);
      myPiUser = me.data;
    } catch (err) {
      console.error(err.response.status);

      if (err.response.status === 401) {
        throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
      }
    }

    const find = await this.authService.findUserByPiID(myPiUser.uid);
    const pass = generatePasswordFromPiUid(myPiUser.uid);
    if (!find) {
      if (!inviteCode) {
        throw new HttpException(
          "Invite code is required",
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!myPiUser.username || !myPiUser.uid) {
        throw new HttpException("Invalid Pi user", HttpStatus.BAD_REQUEST);
      }

      try {
        const user = await this.authService.piSignUp({
          username: myPiUser.username,
          password: pass,
          inviteCode,
          piUid: myPiUser.uid,
        });
        console.log(user);
      } catch (err) {
        console.error(err);
        throw new HttpException(
          "Internal Server Error",
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    // Sign In
    const keycloakTokenUrl = `${config.get("keycloak.baseUrl")}/realms/piday/protocol/openid-connect/token`;

    console.log(keycloakTokenUrl);
    console.log(config.get("keycloak.clientId"));
    console.log(config.get("keycloak.clientSecret"));
    const tokenResponse = await fetch(keycloakTokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: config.get("keycloak.clientId") as string,
        client_secret: config.get("keycloak.clientSecret") as string,
        grant_type: "password",
        username: myPiUser.username.toLowerCase(),
        password: pass,
      }),
    });

    const data = await tokenResponse.json();

    return data;
  }
}
