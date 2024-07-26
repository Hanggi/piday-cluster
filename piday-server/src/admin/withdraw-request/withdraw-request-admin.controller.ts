import { AuthenticatedRequest } from "@/src/lib/keycloak/interfaces/authenticated-request";
import { KeycloakJwtAdminGuard } from "@/src/lib/keycloak/keycloak-jwt-admin.guard";
import { plainToClass, plainToInstance } from "class-transformer";
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

import {
  AcceptWithdrawRequestBody,
  AddPiIDRequestBody,
  OrderByOptions,
  SortByOptions,
} from "../dto/admin.dto";
import { WithdrawRequestDto } from "./dto/withdraw-request-dto";
import { WithdrawRequestAdminService } from "./withdraw-request-admin.service";

@Controller("admin/withdraw-request")
@UseGuards(KeycloakJwtAdminGuard)
export class WithdrawRequestAdminController {
  constructor(
    private readonly withdrawRequestAdminService: WithdrawRequestAdminService,
  ) {}

  @Get()
  async getWithdrawRequest(
    @Query("page") page: number = 1,
    @Query("size") size: number = 50,
    @Query("sort") sort: SortByOptions = SortByOptions.CREATED_AT,
    @Query("orderBy") orderBy: OrderByOptions = OrderByOptions.DESC,
  ) {
    const wrRes = await this.withdrawRequestAdminService.getWithdrawRequest({
      page: +page,
      size: +size,
      sortBy: sort || "createdAt",
      sortOrder: orderBy || "desc",
    });

    const withdrawRequests = wrRes.withdrawRequests.map((request) => ({
      ...request,
      withdrawStatusID: request.withdrawStatusID
        ? request.withdrawStatusID.toString()
        : request.withdrawStatusID,
    }));
    return {
      success: true,
      withdrawRequests,
      totalCount: Number(wrRes.totalCount),
    };
  }

  @Post("accept")
  async acceptWithdrawRequest(
    @Res() res: Response,
    @Body() body: AcceptWithdrawRequestBody,
  ) {
    try {
      const { withdrawStatusID } = body;
      const updateWithdrawRequest =
        await this.withdrawRequestAdminService.acceptWithdrawRequest(
          withdrawStatusID,
        );

      if (!updateWithdrawRequest) {
        res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
          success: false,
          data: null,
          msg: "Withdraw request not accepted",
        });
      }

      res.status(HttpStatus.OK).json({
        msg: "Withdraw request accepted successfully ",
        data: updateWithdrawRequest,
        success: true,
      });
    } catch (error) {
      switch (error.code) {
        case "NOT_FOUND":
          throw new HttpException(
            {
              message: "Request can not be found",
            },
            HttpStatus.FORBIDDEN,
          );
        case "NOT_ENOUGH_BALANCE":
          throw new HttpException(
            {
              message: "Not enough balance in your account",
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

  @Post("add-pi-id")
  async addPiTransactionID(
    @Res() res: Response,
    @Body() body: AddPiIDRequestBody,
  ) {
    const { piTransactionID, withdrawStatusID } = body;

    try {
      const withdrawRequest =
        await this.withdrawRequestAdminService.addPiTransactionIDToWithdrawRequest(
          piTransactionID,
          withdrawStatusID,
        );

      if (!withdrawRequest) {
        res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
          success: false,
          data: null,
          msg: "Withdraw request not updated",
        });
      }

      res.status(HttpStatus.OK).json({
        msg: "Withdraw request updated successfully ",
        data: withdrawRequest,
        success: true,
      });
    } catch (error) {
      console.error("Error", error);
      throw new HttpException(
        "Internal Server Error",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
