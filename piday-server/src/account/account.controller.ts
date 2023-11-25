import { Response } from "express";

import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";

import { AuthenticatedRequest } from "../lib/keycloak/interfaces/authenticated-request";
import { KeycloakJwtGuard } from "../lib/keycloak/keycloak-jwt.guard";
import { KeycloakService } from "../lib/keycloak/keycloak.service";
import { AccountService } from "./account.service";

@Controller("account")
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
    private readonly keycloakService: KeycloakService,
  ) {}

  @UseGuards(KeycloakJwtGuard)
  @Get("balance")
  async getMyBalance(@Req() req: AuthenticatedRequest, @Res() res: Response) {
    try {
      const totalBalance = await this.accountService.getMyBalance({
        userID: req.user.userID,
      });

      res.status(HttpStatus.OK).json({
        balance: totalBalance,
      });
    } catch (err) {
      throw new HttpException(
        "Internal Server Error",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
