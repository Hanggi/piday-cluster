import { Request, Response } from "express";

import {
  Controller,
  Get,
  HttpStatus,
  Query,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";

import { AuthenticatedRequest } from "../lib/keycloak/interfaces/authenticated-request";
import { KeycloakJwtGuard } from "../lib/keycloak/keycloak-jwt.guard";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(KeycloakJwtGuard)
  @Get()
  async getMyUser(@Req() req: AuthenticatedRequest, @Res() res: Response) {
    const myUser = await this.userService.getUser(req.user.userID);

    return res.status(HttpStatus.OK).json({
      user: myUser,
      success: true,
    });
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
