import { Response } from "express";

import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Req,
  Res,
} from "@nestjs/common";

import { AccountService } from "./account.service";

@Controller("account")
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get("balance")
  async getMyBalance(@Req() req: Request, @Res() res: Response) {
    try {
      const totalBalance = await this.accountService.getMyBalance();

      res.status(HttpStatus.OK).json({
        totalBalance,
      });
    } catch (err) {
      throw new HttpException(
        "Internal Server Error",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
