import { Response } from "express";

import {
  Controller,
  Get,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";

import { AuthenticatedRequest } from "../lib/keycloak/interfaces/authenticated-request";
import { KeycloakJwtGuard } from "../lib/keycloak/keycloak-jwt.guard";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(KeycloakJwtGuard)
  @Get()
  async getMyUser(@Req() req: AuthenticatedRequest, @Res() res: Response) {
    const myUser = await this.userService.getUser(req.user.userID);

    return res.status(HttpStatus.OK).json({
      user: myUser,
      success: true,
    });
  }
}
