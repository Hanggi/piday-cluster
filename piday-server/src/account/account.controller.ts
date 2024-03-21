import { plainToInstance } from "class-transformer";
import { Response } from "express";

import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";

import { AuthenticatedRequest } from "../lib/keycloak/interfaces/authenticated-request";
import { KeycloakJwtGuard } from "../lib/keycloak/keycloak-jwt.guard";
import { KeycloakService } from "../lib/keycloak/keycloak.service";
import { UserService } from "../user/user.service";
import { AccountService } from "./account.service";
import { UpdatePiWalletAddressDto } from "./dto/addPiWalletAddress.dto";
import {
  RechargeRecordResponseDto,
  TransferAmountBody,
} from "./dto/rechargeRecords.dto";

@Controller("account")
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
    private readonly keycloakService: KeycloakService,
    private readonly userService: UserService,
  ) {}

  @Get("balance/records")
  @UseGuards(KeycloakJwtGuard)
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

  @Get("balance")
  @UseGuards(KeycloakJwtGuard)
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

  @Put("pi-address")
  @UseGuards(KeycloakJwtGuard)
  async addPiWalletAddress(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Body() body: UpdatePiWalletAddressDto,
  ) {
    if (
      !body.piWalletAddress ||
      body.piWalletAddress == process.env.RECHARGING_ADDRESS
    ) {
      throw new HttpException("Invalid wallet address", HttpStatus.BAD_REQUEST);
    }

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

  @Post("balance/transfer")
  @UseGuards(KeycloakJwtGuard)
  async transferBalance(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Body() body: TransferAmountBody,
  ) {
    try {
      const { amount, to, paymentPassword } = body;
      this.userService.checkPaymentPassword({
        userID: req.user.userID,
        password: paymentPassword,
      });

      await this.accountService.transferAmount(req.user.userID, to, amount);

      res.status(HttpStatus.OK).json({
        success: true,
        message: "recharge record created",
      });

      return;
    } catch (error) {
      switch (error.code) {
        case "NOT_ENOUGH_BALANCE":
          throw new HttpException("Not enough balance.", HttpStatus.FORBIDDEN);
        case "IN_VALID_WALLET_ADDRESS":
          throw new HttpException("User not found.", HttpStatus.NOT_FOUND);
        case "INVALID_PASSWORD":
          throw new HttpException(
            "In valid payment password.",
            HttpStatus.NOT_FOUND,
          );
      }
      console.error("Error", error);
      throw new HttpException(
        "Internal Server Error",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
