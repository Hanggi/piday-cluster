import { plainToClass } from "class-transformer";
import { Response } from "express";

import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";

import { AuthenticatedRequest } from "../lib/keycloak/interfaces/authenticated-request";
import { KeycloakJwtGuard } from "../lib/keycloak/keycloak-jwt.guard";
import { VirtualEstateResponseDto } from "./dto/virtual-estate.dto";
import { VirtualEstateService } from "./virtual-estate.service";

@Controller("virtual-estate")
export class VirtualEstateController {
  constructor(private readonly virtualEstateService: VirtualEstateService) {}

  @Get("all-by-user")
  @UseGuards(KeycloakJwtGuard)
  async getAllVirtualEstates(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
  ) {
    const virtualEstates =
      await this.virtualEstateService.getAllVirtualEstatesForSignedUser(
        req.user.userID,
      );

    if (!virtualEstates) {
      res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        data: null,
        message: "No virtual estates found by this user",
      });
    }

    res.status(HttpStatus.OK).json({
      data: virtualEstates,
      success: true,
      message: "Virtual states found successfully",
    });
    try {
    } catch (error) {
      console.error(error);
      throw new HttpException(
        "Internal Server Error",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(":hexID")
  async getHexID(
    @Param("hexID") hexID,
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
  ) {
    try {
      const virtualEstate =
        await this.virtualEstateService.getOneVirtualEstate(hexID);

      if (!virtualEstate) {
        res.status(HttpStatus.NOT_FOUND).json({
          message: "Virtual Estate not found",
        });
        return;
      }

      // console.log(virtualEstate);
      // console.log(typeof virtualEstate.lastPrice);
      // console.log(
      //   plainToClass(VirtualEstateResponseDto, virtualEstate, {
      //     excludeExtraneousValues: true,
      //   }),
      // );

      res.status(HttpStatus.OK).json({
        ve: plainToClass(VirtualEstateResponseDto, virtualEstate, {
          excludeExtraneousValues: true,
        }),
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
