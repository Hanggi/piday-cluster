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
} from "@nestjs/common";

import { AuthenticatedRequest } from "../lib/keycloak/interfaces/authenticated-request";
import { VirtualEstateResponseDto } from "./dto/virtual-estate.dto";
import { VirtualEstateService } from "./virtual-estate.service";

@Controller("virtual-estate")
export class VirtualEstateController {
  constructor(private readonly virtualEstateService: VirtualEstateService) {}

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
