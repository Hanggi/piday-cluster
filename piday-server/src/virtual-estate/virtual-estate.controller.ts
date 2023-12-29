import { plainToInstance } from "class-transformer";
import { Response } from "express";

import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
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
import { VirtualEstateListingResponseDto } from "../virtual-estate-listing/dto/virtual-estate-listing.dto";
import { VirtualEstateListingService } from "../virtual-estate-listing/virtual-estate-listing.service";
import { VirtualEstateTransactionRecordsService } from "../virtual-estate-transaction-records/virtual-estate-transaction-records.service";
import { VirtualEstateResponseDto } from "./dto/virtual-estate.dto";
import { HexIdValidationPipe } from "./pipes/hex-id-validation.pipe";
import { VirtualEstateService } from "./virtual-estate.service";

@Controller("virtual-estates")
export class VirtualEstateController {
  constructor(
    private readonly accountService: AccountService,
    private readonly virtualEstateService: VirtualEstateService,
    private readonly virtualEstateListingService: VirtualEstateListingService,
    private readonly virtualEstateTransactionRecordsService: VirtualEstateTransactionRecordsService,
  ) {}

  @Get()
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

  @Get("transaction")
  @UseGuards(KeycloakJwtGuard)
  async getAllTransactionRecordsForUserBasedOnType(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Query("side") side = "both", // default to both
  ) {
    try {
      const transactionRecordsForUser =
        await this.virtualEstateTransactionRecordsService.getAllTransactionRecordsForUserBasedOnType(
          req.user.userID,
          side,
        );

      if (!transactionRecordsForUser) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          virtualEstates: null,
          message: "No Transaction records found by this user",
        });
      }

      res.status(HttpStatus.OK).json({
        transactionRecords: transactionRecordsForUser,
        success: true,
        message: "Transaction records found successfully",
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
      switch (err.code) {
        case "NOT_ENOUGH_BALANCE":
          throw new HttpException(
            {
              message: "Not enough balance",
            },
            HttpStatus.FORBIDDEN,
          );
      }

      throw new HttpException(
        "Internal Server Error",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(":hexID/listing")
  async getVirtualEstateListingOffers(
    @Param("hexID") hexID,
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
  ) {
    // TODO: Add pagination
    try {
      const virtualEstateListings =
        await this.virtualEstateListingService.getVirtualEstateOffersAndBidding(
          hexID,
        );

      if (!virtualEstateListings) {
        res.status(HttpStatus.NOT_FOUND).json({
          message: "Virtual Estate not found",
        });
        return;
      }

      res.status(HttpStatus.OK).json({
        virtualEstateListings: plainToInstance(
          VirtualEstateListingResponseDto,
          virtualEstateListings,
          {
            excludeExtraneousValues: true,
          },
        ),
      });
    } catch (err) {
      console.error(err);
      throw new HttpException(
        "Internal Server Error",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(KeycloakJwtGuard)
  @Patch(":hexID/bid/:bidID/accept")
  async acceptBidToSellVirtualEstate(
    @Param("hexID") hexID,
    @Param("bidID") bidID,
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
  ) {
    try {
      const sellerID = req.user.userID;

      const transactionRecord =
        await this.virtualEstateTransactionRecordsService.acceptBidToSellVirtualEstate(
          {
            virtualEstateID: hexID,
            sellerID,
            bidID,
          },
        );

      if (!transactionRecord) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          transactionRecord: null,
        });
      }
      res.status(HttpStatus.OK).json({
        success: true,
        transactionRecord,
      });
    } catch (error) {
      console.error(error);
      throw new HttpException(
        "Internal Server Error",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(":hexID")
  async getOneVirtualEstate(
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
        ve: plainToInstance(VirtualEstateResponseDto, virtualEstate, {
          excludeExtraneousValues: true,
        }),
      });
    } catch (error) {
      console.error(error);
      throw new HttpException(
        "Internal Server Error",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(":hexID/in-area")
  async getHexIDsStatusInArea(@Param("hexID") hexID, @Res() res: Response) {
    try {
      const hexIDs = await this.virtualEstateService.getHexIDsStatusInArea({
        hexID,
      });

      res.status(HttpStatus.OK).json({
        ...hexIDs,
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
