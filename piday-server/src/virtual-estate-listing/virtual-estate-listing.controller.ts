import { Response } from "express";
import FlakeIdGen from "flake-idgen";

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes, // UsePipes, // UsePipes,
} from "@nestjs/common";

import { AuthenticatedRequest } from "../lib/keycloak/interfaces/authenticated-request";
import { KeycloakJwtGuard } from "../lib/keycloak/keycloak-jwt.guard";
import { HexIdValidationPipe } from "../virtual-estate/pipes/hex-id-validation.pipe";
// import { HexIdValidationPipe } from "../virtual-estate/pipes/hex-id-validation.pipe";
// import { HexIdValidationPipe } from "../virtual-estate/pipes/hex-id-validation.pipe";
import { CreateVirtualEstateListingDto } from "./dto/create-virtual-estate-listing.dto";
import { VirtualEstateListingService } from "./virtual-estate-listing.service";

@Controller("virtual-estate-listing")
export class VirtualEstateListingController {
  constructor(
    private readonly virtualEstateListingService: VirtualEstateListingService,
  ) {}

  @UseGuards(KeycloakJwtGuard)
  @Post(":hexID/bid")
  @UsePipes(new HexIdValidationPipe())
  async create(
    @Param("hexID") hexID,
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Body() createVirtualEstateListingDto: CreateVirtualEstateListingDto,
  ) {
    try {
      console.log("In side post virtual estate listing ");
      const generator = new FlakeIdGen();

      const idBuffer = generator.next();

      // 将 Buffer 转换为 BigInt，然后转换为十进制字符串
      const idDecimalString = BigInt(
        "0x" + idBuffer.toString("hex"),
      ).toString();

      const { price, type } = createVirtualEstateListingDto;
      const virtualEstateListing =
        await this.virtualEstateListingService.create({
          virtualEstateID: hexID,
          ownerID: req.user.userID,
          expiresAt: new Date(new Date().getDate() + 30),
          listingID: parseInt(idDecimalString),
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

  @Get()
  findAll() {
    console.log("Find all ");
    return this.virtualEstateListingService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.virtualEstateListingService.findOne(+id);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.virtualEstateListingService.remove(+id);
  }
}
