import { plainToInstance } from "class-transformer";
import { Response } from "express";

import {
  Body,
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
  ValidationPipe,
} from "@nestjs/common";

import { AuthenticatedRequest } from "../lib/keycloak/interfaces/authenticated-request";
import { KeycloakJwtGuard } from "../lib/keycloak/keycloak-jwt.guard";
import { VirtualEstateResponseDto } from "../virtual-estate/dto/virtual-estate.dto";
import { HexIdValidationPipe } from "../virtual-estate/pipes/hex-id-validation.pipe";
import { CreateVirtualEstateListingDto } from "./dto/create-virtual-estate-listing.dto";
import { VirtualEstateListingResponseDto } from "./dto/virtual-estate-listing.dto";
import { VirtualEstateListingService } from "./virtual-estate-listing.service";

@Controller("virtual-estate-listing")
export class VirtualEstateListingController {
  constructor(
    private readonly virtualEstateListingService: VirtualEstateListingService,
  ) {}

  @UseGuards(KeycloakJwtGuard)
  @Post(":hexID/bid")
  @UsePipes(new ValidationPipe({ transform: true }))
  async createVirtualEstateListing(
    @Param("hexID", HexIdValidationPipe) hexID,
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Body() { price, type, expiresAt }: CreateVirtualEstateListingDto,
  ) {
    try {
      const virtualEstateListing =
        await this.virtualEstateListingService.createVirtualEstateListing({
          virtualEstateID: hexID,
          ownerID: req.user.userID,
          expiresAt,
          price,
          type,
        });

      if (!virtualEstateListing) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          virtualEstates: null,
          message: "Virtual estate Listing not created",
        });
      }

      res.status(HttpStatus.OK).json({
        virtualEstateListing: plainToInstance(
          VirtualEstateListingResponseDto,
          virtualEstateListing,
          {
            excludeExtraneousValues: true,
          },
        ),
        success: true,
        message: "Virtual states listing created successfully",
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
