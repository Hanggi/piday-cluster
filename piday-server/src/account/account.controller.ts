import { plainToInstance } from "class-transformer";
import { Response } from "express";

import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";

import { AuthenticatedRequest } from "../lib/keycloak/interfaces/authenticated-request";
import { KeycloakJwtGuard } from "../lib/keycloak/keycloak-jwt.guard";
import { KeycloakService } from "../lib/keycloak/keycloak.service";
import { AccountService } from "./account.service";
import { UpdatePiWalletAddressDto } from "./dto/addPiWalletAddress.dto";
import { RechargeRecordResponseDto } from "./dto/rechargeRecords.dto";

@Controller("account")
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
    private readonly keycloakService: KeycloakService,
  ) {}

  @UseGuards(KeycloakJwtGuard)
  @Get("balance/records")
  async getMyAllRechargeRecords(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Query("page") page = "1", // default to page 1
    @Query("size") size = "10", //default to size 10,
  ) {
    try {
      const { records, totalCount } =
        await this.accountService.getMyAllRechargeRecords(
          req.user.userID,
          parseInt(size),
          parseInt(page),
        );

      if (!records) {
        res.status(HttpStatus.NOT_FOUND).json({
          rechargeRecords: null,
        });
      }
      res.status(HttpStatus.OK).json({
        rechargeRecords: plainToInstance(RechargeRecordResponseDto, records, {
          excludeExtraneousValues: true,
        }),
        totalCount,
      });
    } catch (err) {
      console.error(err);
      throw new HttpException(
        "Internal Server Error",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

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

  @UseGuards(KeycloakJwtGuard)
  @Put("pi-address")
  async addPiWalletAddress(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Body() body: UpdatePiWalletAddressDto,
  ) {
    try {
      const user = await this.accountService.updateWalletAddress(
        req.user.userID,
        body.piWalletAddress,
      );

      if (!user) {
        res
          .status(HttpStatus.NOT_FOUND)
          .json({ success: false, message: "User not updated", user: null });
      }
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Pi wallet address updated successfully",
        user: user,
      });
    } catch (error) {
      throw new HttpException(
        "Internal Server Error",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
