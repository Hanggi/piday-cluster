import { Request, Response } from "express";

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

import { AuthenticatedRequest } from "../lib/keycloak/interfaces/authenticated-request";
import { KeycloakJwtGuard } from "../lib/keycloak/keycloak-jwt.guard";
import { UpdateNationalityDto } from "./dto/update-nationality.dto";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(KeycloakJwtGuard)
  @Get()
  async getMyUser(@Req() req: AuthenticatedRequest, @Res() res: Response) {
    const myUser = await this.userService.getUser(req.user.userID);

    // Sanitize user data
    delete myUser.keycloakID;
    delete myUser.piUid;
    const isPaymentPasswordSet = !!myUser.paymentPassword;
    delete myUser.paymentPassword;

    return res.status(HttpStatus.OK).json({
      user: { ...myUser, isPaymentPasswordSet },
      success: true,
    });
  }

  @UseGuards(KeycloakJwtGuard)
  @Post("update-nationality")
  async updateUserNationality(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Body() { nationality }: UpdateNationalityDto,
  ) {
    try {
      await this.userService.updateUserNationality(
        req.user.userID,
        nationality,
      );

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Successfully updated nationality",
      });
    } catch (error) {
      switch (error.code) {
        case "USER_NOT_FOUND":
          throw new HttpException("user not found", HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        "Internal Server Error",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get("info")
  async getUserInfo(
    @Req() req: Request,
    @Res() res: Response,
    @Query("email") email?: string,
    @Query("userID") userID?: string,
    @Query("walletAddress") walletAddress?: string,
  ) {
    const userInfo = await this.userService.getUserInfo(
      email == "null" ? null : email,
      userID == "null" ? null : userID,
      walletAddress == "null" ? null : walletAddress,
    );

    if (!userInfo)
      return res.status(HttpStatus.NOT_FOUND).json({
        user: null,
        success: false,
      });

    return res.status(HttpStatus.OK).json({
      user: userInfo,
      success: true,
    });
  }
  @UseGuards(KeycloakJwtGuard)
  @Get("get-invite-code")
  async generateInviteCode(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
  ) {
    const inviteCode = await this.userService.generateInviteCode(
      req.user.userID,
    );
    if (!inviteCode) {
      return res.status(400).json({ success: false, data: null });
    }
    return res.status(200).json({ success: true, inviteCode: inviteCode });
  }
}
