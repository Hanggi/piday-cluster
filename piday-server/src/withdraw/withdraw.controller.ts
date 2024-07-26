import { Decimal } from "@prisma/client/runtime/library";
import { Response } from "express";

import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";

import { AuthenticatedRequest } from "../lib/keycloak/interfaces/authenticated-request";
import { KeycloakJwtGuard } from "../lib/keycloak/keycloak-jwt.guard";
import { UserService } from "../user/user.service";
import {
  CancelWithdrawRequestDTO,
  CreateWithdrawRequestDTO,
} from "./dto/createWithdrawRequest.dto";
import { WithdrawService } from "./withdraw.service";

@Controller("withdraw")
export class WithdrawController {
  constructor(
    private readonly withdrawService: WithdrawService,
    private readonly userService: UserService,
  ) {}

  @Post("create")
  @UseGuards(KeycloakJwtGuard)
  async createWithdrawRequest(
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
    @Body() body: CreateWithdrawRequestDTO,
  ) {
    try {
      const paymentPassword = body.paymentPassword;
      await this.userService.checkPaymentPassword({
        userID: req.user.userID,
        password: paymentPassword,
      });

      const amount = new Decimal(body.amount);

      const userID = req.user.userID;

      const withdrawRequest = await this.withdrawService.createWithdrawRequest(
        amount,
        userID,
      );
      if (!withdrawRequest) {
        res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
          msg: "Withdraw request not created successfiully",
          data: null,
          success: false,
        });
      }

      res.status(HttpStatus.OK).json({
        msg: "Withdraw request created successfully ",
        data: withdrawRequest,
        success: true,
      });
    } catch (error) {
      switch (error.code) {
        case "NOT_ENOUGH_BALANCE":
          throw new HttpException(
            {
              message: "Not enough balance",
            },
            HttpStatus.FORBIDDEN,
          );
        case "INVALID_PASSWORD":
          throw new HttpException(
            {
              message: "Payment password invalid",
            },
            HttpStatus.FORBIDDEN,
          );
      }
      console.error("Error", error);
      throw new HttpException(
        "Internal Server Error",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post("cancel")
  @UseGuards(KeycloakJwtGuard)
  async cancelWithdrawRequest(
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
    @Body() body: CancelWithdrawRequestDTO,
  ) {
    try {
      const withdrawStatusID = body.withdrawStatusID;
      const userID = req.user.userID;
      const withdrawRequest = await this.withdrawService.cancelWithdrawRequest(
        withdrawStatusID,
        userID,
      );
      if (withdrawRequest) {
        res.status(HttpStatus.OK).json({
          msg: "Withdraw request updated successfully ",
          data: withdrawRequest,
          success: true,
        });
      } else {
        res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
          msg: "Withdraw request not updated successfiully",
          data: null,
          success: false,
        });
      }
    } catch (error) {
      switch (error.code) {
        case "CAN_NOT_BE_CANCELLED":
          throw new HttpException(
            {
              message: "Request can not be canceled already accepted",
            },
            HttpStatus.FORBIDDEN,
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
