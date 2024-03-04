import { Decimal } from "@prisma/client/runtime/library";
import { Request, Response } from "express";

import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Res,
} from "@nestjs/common";

import { AuthenticatedRequest } from "../lib/keycloak/interfaces/authenticated-request";
import {
  CancelWithdrawRequestDTO,
  CreateWithdrawRequestDTO,
} from "./dto/createWithdrawRequest.dto";
import { WithdrawService } from "./withdraw.service";

@Controller("withdraw")
export class WithdrawController {
  constructor(private readonly withdrawService: WithdrawService) {}

  @Post("create")
  async createWithdrawRequest(
    @Res() res: Response,
    req: AuthenticatedRequest,
    @Body() body: CreateWithdrawRequestDTO,
  ) {
    try {
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
      }
      console.error("Error", error);
      throw new HttpException(
        "Internal Server Error",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post("cancel")
  async cancelWithdrawRequest(
    @Res() res: Response,
    req: AuthenticatedRequest,
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
