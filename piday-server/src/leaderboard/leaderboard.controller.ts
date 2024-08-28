import { Response } from "express";

import { Controller, Get, HttpStatus, Req, Res } from "@nestjs/common";

import { LeaderBoardService } from "./leaderboard.service";

@Controller("leaderboard")
export class LeaderBoardController {
  constructor(private readonly leaderBoardService: LeaderBoardService) {}

  @Get("invitation-rank")
  async getInvitationRank(@Req() req: Request, @Res() res: Response) {
    const result = await this.leaderBoardService.getInvitationRank();
    res.status(HttpStatus.OK).json({
      success: true,
      invite: result,
    });
  }

  @Get("commission-rank")
  async getCommissionRank(@Req() req: Request, @Res() res: Response) {
    const result = await this.leaderBoardService.getCommissionRank();
    res.status(HttpStatus.OK).json({
      success: true,
      commission: result,
    });
  }

  @Get("points-rank")
  async getPointsRank(@Req() req: Request, @Res() res: Response) {
    const result = await this.leaderBoardService.getPointsRank();
    res.status(HttpStatus.OK).json({
      success: true,
      points: result,
    });
  }
}
