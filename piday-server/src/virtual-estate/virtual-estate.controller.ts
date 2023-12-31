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
import { VirtualEstateTransactionRecordResponseDto } from "../virtual-estate-transaction-records/dto/create-virtual-estate-transaction-record.dto";
import { VirtualEstateTransactionRecordsService } from "../virtual-estate-transaction-records/virtual-estate-transaction-records.service";
import { VirtualEstatesStatistics } from "./dto/statistics.dto";
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
  async getMyVirtualEstates(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Query("page") page = 1, // default to page 1
    @Query("size") size = 10, //default to size 10,
  ) {
    try {
      const virtualEstatesRes =
        await this.virtualEstateService.getAllVirtualEstatesForSignedUser(
          req.user.userID,
          size,
          page,
        );

      if (!virtualEstatesRes.myVirtualEstates) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          virtualEstates: null,
          message: "No virtual estates found by this user",
        });
      }

      res.status(HttpStatus.OK).json({
        virtualEstates: plainToInstance(
          VirtualEstateResponseDto,
          virtualEstatesRes.myVirtualEstates,
          {
            excludeExtraneousValues: true,
          },
        ),
        totalCount: virtualEstatesRes.totalCount,
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

  @Get("statistics")
  async getVirtualEstatesStatistics(
    @Res() res: Response,
    @Query("totalMinted") totalMinted,
    @Query("listings") listings,
    @Query("transactionVolume") transactionVolume,
    @Query("transactionCount") transactionCount,
    @Query("startDate") startDate: string,
    @Query("endDate") endDate: string,
  ) {
    try {
      // TODO(Zawar): Add Redis Caching
      const start = startDate ? new Date(startDate) : new Date("30-oct-2023");
      const end = endDate ? new Date(endDate) : new Date();
      const responseObject: VirtualEstatesStatistics = {};

      if ((totalMinted = "true")) {
        responseObject.totalVirtualEstatesMinted =
          await this.virtualEstateService.getVirtualEstateTotalMinted(
            end,
            start,
          );
      }

      if ((listings = "true")) {
        responseObject.virtualEstateListingCount =
          await this.virtualEstateListingService.getVirtualEstateListingsCount(
            end,
            start,
          );
      }

      if ((transactionVolume = "true")) {
        responseObject.totalTransactionVolume =
          await this.virtualEstateTransactionRecordsService.getTotalTransactionVolume(
            end,
            start,
          );
      }

      if ((transactionCount = "true")) {
        responseObject.transactionRecordsCount =
          await this.virtualEstateTransactionRecordsService.getVirtualEstateTransactionRecordsCount(
            end,
            start,
          );
      }

      res.status(200).json({ statistics: responseObject });
    } catch (err) {
      console.error(err);
      throw new HttpException(
        "Internal Server Error",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get("transactions")
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
        transactionRecords: plainToInstance(
          VirtualEstateTransactionRecordResponseDto,
          transactionRecordsForUser,
          {
            excludeExtraneousValues: true,
          },
        ),
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

      switch (err.code) {
        case "BID_NOT_FOUND":
          throw new HttpException(
            {
              message: "bid not found",
            },
            HttpStatus.NOT_FOUND,
          );
      }

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

      const virtualEstate =
        await this.virtualEstateService.getOneVirtualEstate(hexID);
      if (virtualEstate.ownerID !== sellerID) {
        throw new HttpException(
          "Virtual Estate not owned by seller",
          HttpStatus.FORBIDDEN,
        );
      }

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

  @Get(":hexID/transactions")
  async getVirtualEstateTransactionRecords(
    @Param("hexID") hexID,
    @Res() res: Response,
    @Query("page") page = "1", // default to page 1
    @Query("size") size = "10", //default to size 10,
  ) {
    try {
      const virtualEstateTransactionRecords =
        await this.virtualEstateTransactionRecordsService.getAllTransactionRecordsForVirtualEstate(
          hexID,
          parseInt(size),
          parseInt(page),
        );

      res.status(HttpStatus.OK).json({
        transactions: plainToInstance(
          VirtualEstateTransactionRecordResponseDto,
          virtualEstateTransactionRecords,
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
}
