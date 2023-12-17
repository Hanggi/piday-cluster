import { plainToClass } from "class-transformer";
import { Response } from "express";

import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  UsePipes,
} from "@nestjs/common";

import { AccountService } from "../account/account.service";
import { AuthenticatedRequest } from "../lib/keycloak/interfaces/authenticated-request";
import { KeycloakJwtGuard } from "../lib/keycloak/keycloak-jwt.guard";
import { VirtualEstateResponseDto } from "./dto/virtual-estate.dto";
import { HexIdValidationPipe } from "./pipes/hex-id-validation.pipe";
import { VirtualEstateService } from "./virtual-estate.service";

@Controller("virtual-estate")
export class VirtualEstateController {
  constructor(
    private readonly accountService: AccountService,
    private readonly virtualEstateService: VirtualEstateService,
  ) {}

  @Get("all")
  @UseGuards(KeycloakJwtGuard)
  async getAllVirtualEstates(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Query("page") page = "1", // default to page 1
    @Query("size") size = "10", //default to size 10,
  ) {
    try {
      const virtualEstates =
        await this.virtualEstateService.getAllVirtualEstatesForSignedUser(
          req.user.userID,
          parseInt(size),
          parseInt(page),
        );

      if (!virtualEstates) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          virtualEstates: null,
          message: "No virtual estates found by this user",
        });
      }

      res.status(HttpStatus.OK).json({
        virtualEstates: virtualEstates,
        success: true,
        message: "Virtual states found successfully",
      });
    } catch (error) {
      console.error(error);
      throw new HttpException(
        "Internal Server Error",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(KeycloakJwtGuard)
  @Post(":hexID")
  @UsePipes(new HexIdValidationPipe())
  async mintVirtualEstate(
    @Param("hexID") hexID,
    @Req() req: AuthenticatedRequest,
  ) {
    try {
      // TODO(Hanggi): Check the virtual estate is already minted or not
      const existing =
        await this.virtualEstateService.getOneVirtualEstate(hexID);

      if (existing) {
        throw new HttpException(
          "Virtual Estate already minted",
          HttpStatus.BAD_REQUEST,
        );
      }

      const virtualEstate = await this.virtualEstateService.mintVirtualEstate({
        userID: req.user.userID,
        hexID,
      });

      return virtualEstate;
    } catch (err) {
      console.error(err);
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
