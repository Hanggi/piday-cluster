import { Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";

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
    await this.pointService.checkIn({ userID });

    return {
      message: "Checked in successfully",
    };
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
