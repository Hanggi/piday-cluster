import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";

import { AuthenticatedRequest } from "../lib/keycloak/interfaces/authenticated-request";
import { KeycloakJwtGuard } from "../lib/keycloak/keycloak-jwt.guard";
import { PointService } from "./point.service";

@Controller("point")
export class PointController {
  constructor(private readonly pointService: PointService) {}

  @Get()
  @UseGuards(KeycloakJwtGuard)
  async getMyPoint(@Req() req: AuthenticatedRequest) {
    const { userID } = req.user;
    const point = await this.pointService.getMyPoint({ userID });

    return {
      point,
    };
  }

  @Get("records")
  @UseGuards(KeycloakJwtGuard)
  async getMyPointRecords(
    @Req() req: AuthenticatedRequest,
    @Query("page") page = 1,
    @Query("size") size = 20,
  ) {
    const { userID } = req.user;
    const pointRecordRes = await this.pointService.getMyPointRecords({
      userID,
      page: +page,
      size: +size,
    });

    return {
      ...pointRecordRes,
    };
  }

  @Post("check-in")
  @UseGuards(KeycloakJwtGuard)
  async checkIn(@Req() req: AuthenticatedRequest) {
    const { userID } = req.user;

    try {
      await this.pointService.checkIn({ userID });

      return {
        success: true,
        message: "Checked in successfully",
      };
    } catch (err) {
      switch (err.code) {
        case "ALREADY_CHECKED_IN_TODAY":
          throw new HttpException(
            "Already checked in today",
            HttpStatus.BAD_REQUEST,
          );
      }

      throw new HttpException(
        "Internal server error",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get("info")
  @UseGuards(KeycloakJwtGuard)
  async getPointInfo(@Req() req: AuthenticatedRequest) {
    const { userID } = req.user;
    const pointInfo = await this.pointService.getPointInfo({ userID });

    return {
      ...pointInfo,
    };
  }
}
