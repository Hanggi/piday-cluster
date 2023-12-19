import { Response } from "express";

import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes
} from "@nestjs/common";

import { AuthenticatedRequest } from "../lib/keycloak/interfaces/authenticated-request";
import { KeycloakJwtGuard } from "../lib/keycloak/keycloak-jwt.guard";
import { HexIdValidationPipe } from "../virtual-estate/pipes/hex-id-validation.pipe";
import { CreateVirtualEstateListingDto } from "./dto/create-virtual-estate-listing.dto";
import { VirtualEstateListingService } from "./virtual-estate-listing.service";

@Controller("virtual-estate-listing")
export class VirtualEstateListingController {
  constructor(
    private readonly virtualEstateListingService: VirtualEstateListingService,
  ) {}

  @UseGuards(KeycloakJwtGuard)
  @Post(":hexID/bid")
  async createVirtualEstateListing(
    @Param("hexID" , HexIdValidationPipe) hexID,
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Body() createVirtualEstateListingDto: CreateVirtualEstateListingDto,
  ) {
    try {
      //TODO : Check for existing bids and invalidate them 
      const { price, type } = createVirtualEstateListingDto;
      const virtualEstateListing =
        await this.virtualEstateListingService.createVirtualEstateListing({
          virtualEstateID: hexID,
          ownerID: req.user.userID,
          expiresAt: new Date(new Date().getDate() + 30),
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
        virtualEstateListing: virtualEstateListing,
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
