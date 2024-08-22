import { KeycloakJwtAdminGuard } from "@/src/lib/keycloak/keycloak-jwt-admin.guard";
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

import { OrderByOptions, SortByOptions } from "../dto/admin.dto";
import { UserAdminService } from "./user-admin.service";

@Controller("admin/users")
@UseGuards(KeycloakJwtAdminGuard)
export class UserAdminController {
  constructor(private readonly userAdminService: UserAdminService) {}

  @Get()
  // @UseGuards(KeycloakJwtAdminGuard)
  async getMyVirtualEstates(
    @Req() req: Request,
    @Res() res: Response,
    @Query("page") page: number = 1,
    @Query("size") size: number = 50,
    @Query("sort") sort: SortByOptions = SortByOptions.CREATED_AT,
    @Query("orderBy") orderBy: OrderByOptions = OrderByOptions.DESC,
    @Query("email") email?: string,
    @Query("username") username?: string,
    @Query("piAddress") piAddress?: string,
    @Query("withBalance") withBalance?: boolean,
  ) {
    try {
      const userResponse = await this.userAdminService.getAllUsers(
        page,
        size,
        sort,
        orderBy,
        email,
        username,
        piAddress,
        withBalance,
      );

      if (!userResponse.user) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          virtualEstates: null,
          message: "No users found",
        });
      }

      res.status(HttpStatus.OK).json({
        users: userResponse.user,
        totalCount: userResponse.totalCount,
        success: true,
        message: "Users found successfully",
      });
    } catch (error) {
      console.error(error);
      throw new HttpException(
        "Internal Server Error",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get("general-ledger")
  async getGeneralLedger() {
    const generalLedger = await this.userAdminService.getGeneralLedger();

    return {
      success: true,
      ledger: generalLedger,
    };
  }

  @Get("ledger-records")
  async getLedgerRecords(
    @Query("page") page: number = 1,
    @Query("size") size: number = 50,
  ) {
    const ledgerRecords = await this.userAdminService.getLedgerRecords({
      page,
      size,
    });

    return {
      success: true,
      ...ledgerRecords,
    };
  }
  @Post("balance/records")
  async getRechargeRecordsByUserId(
    @Body() { userID }: { userID: string },
    @Res() res: Response,
    @Query("page") page = "1", // default to page 1
    @Query("size") size = "10", //default to size 10,
  ) {
    try {
      const { records, totalCount } =
        await this.userAdminService.getRechargeRecordsByUserId(
          userID,
          parseInt(size),
          parseInt(page),
        );

      if (!records) {
        res.status(HttpStatus.NOT_FOUND).json({
          rechargeRecords: null,
        });
      }
      res.status(HttpStatus.OK).json({
        rechargeRecords: records,
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
}
