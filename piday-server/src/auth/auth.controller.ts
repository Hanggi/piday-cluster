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
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";

import { AuthenticatedRequest } from "../lib/keycloak/interfaces/authenticated-request";
import { KeycloakJwtGuard } from "../lib/keycloak/keycloak-jwt.guard";
import { UserService } from "../user/user.service";
import { AuthService } from "./auth.service";
import { EmailQueryDto, EmailSignupDto } from "./dto/email-query.dto";
import { UpdatePasswordDto } from "./dto/update-password.dto";
import { generatePasswordFromPiUid } from "./utils/generatePiUidPass";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userSerivce: UserService,
  ) {}

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
        case "INVALID_INVITE_CODE":
          throw new HttpException(
            "Invalid invite code",
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
      } catch (err) {
        console.error(err);

        switch (err.code) {
          case "INVALID_INVITE_CODE":
            throw new HttpException(
              "Invalid invite code",
              HttpStatus.BAD_REQUEST,
            );
        }

        throw new HttpException(
          "Internal Server Error",
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    // Sign In
    const keycloakTokenUrl = `${config.get("keycloak.baseUrl")}/realms/piday/protocol/openid-connect/token`;

    const tokenResponse = await fetch(keycloakTokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: config.get("keycloak.clientId") as string,
        client_secret: config.get("keycloak.clientSecret") as string,
        grant_type: "password",
        username: "pi_" + myPiUser.username.toLowerCase(),
        password: pass,
      }),
    });

    const data = await tokenResponse.json();

    return data;
  }

  // Set payment password
  @Post("payment-password")
  @UseGuards(KeycloakJwtGuard)
  async setPaymentPassword(
    @Body() { password }: { password: string },
    @Req() req: AuthenticatedRequest,
  ) {
    if (password.length < 6) {
      throw new HttpException(
        "Password must be at least 6 characters",
        HttpStatus.BAD_REQUEST,
      );
    }

    const { userID } = req.user;

    await this.userSerivce.setPaymentPassword({ userID, password });

    return {
      message: "Payment password set",
    };
  }

  @Post("update-password")
  @UseGuards(KeycloakJwtGuard)
  async updateAccountPassword(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Body() body: UpdatePasswordDto,
  ) {
    try {
      const { newPassword, oldPassword, confirmPassword } = body;

      const result = await this.authService.updateAccountPassword(
        newPassword,
        oldPassword,
        confirmPassword,
        req.user.userID,
      );

      if (!result) {
        res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
          success: result,
          message: "Error updating password please try again",
        });
      }
      res.status(HttpStatus.OK).json({
        success: result,
        message: "Successfully updated password",
      });
    } catch (err) {
      console.error(err);

      switch (err.code) {
        case "INVALID_PASSWORD":
          throw new HttpException("Invalid Password", HttpStatus.UNAUTHORIZED);
        case "USER_NOT_FOUND":
          throw new HttpException("user not found", HttpStatus.NOT_FOUND);
        case "PASSWORD_DO_NOT_MATCH":
          throw new HttpException(
            "password does not match",
            HttpStatus.BAD_REQUEST,
          );
      }

      throw new HttpException(
        "Internal Server Error",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
