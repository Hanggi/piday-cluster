import { Response } from "express";

import { Controller, Get, HttpStatus, Query, Req, Res } from "@nestjs/common";

import { LeaderBoardService } from "./leaderboard.service";

@Controller("leaderboard")
export class LeaderBoardController {
  constructor(private readonly leaderBoardService: LeaderBoardService) {}

  @Get("invitation-rank")
  async getInvitationRank(
    @Req() req: Request,
    @Res() res: Response,
    @Query("page") page = 1,
    @Query("size") size = 10,
  ) {
    const result = await this.leaderBoardService.getInvitationRank(page, size);
    res.status(HttpStatus.OK).json({
      success: true,
      invite: result,
    });
  }

  @Get("commission-rank")
  async getCommissionRank(
    @Req() req: Request,
    @Res() res: Response,
    @Query("page") page = 1,
    @Query("size") size = 10,
  ) {
    const result = await this.leaderBoardService.getCommissionRank(page, size);
    res.status(HttpStatus.OK).json({
      success: true,
      commission: result,
    });
  }

  @Get("points-rank")
  async getPointsRank(
    @Req() req: Request,
    @Res() res: Response,
    @Query("page") page = 1,
    @Query("size") size = 10,
  ) {
    const result = await this.leaderBoardService.getPointsRank(page, size);
    res.status(HttpStatus.OK).json({
      success: true,
      points: result,
    });
  }
}
