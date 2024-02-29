import { KeycloakJwtAdminGuard } from "@/src/lib/keycloak/keycloak-jwt-admin.guard";
import { Response } from "express";

import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
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
  @UseGuards(KeycloakJwtAdminGuard)
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
}
