import { plainToInstance } from "class-transformer";
import { Response } from "express";

import {
  Body,
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
} from "@nestjs/common";

import { AccountService } from "../account/account.service";
import commonControllerErrorHandler from "../lib/errors/common-controller-error-handler";
import { AuthenticatedRequest } from "../lib/keycloak/interfaces/authenticated-request";
import { KeycloakJwtGuard } from "../lib/keycloak/keycloak-jwt.guard";
import { UserService } from "../user/user.service";
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
    private readonly userService: UserService,
    private readonly virtualEstateService: VirtualEstateService,
    private readonly virtualEstateListingService: VirtualEstateListingService,
    private readonly virtualEstateTransactionRecordsService: VirtualEstateTransactionRecordsService,
  ) {}

  // =============================================================================
  // Public Active Virtual Estates
  // =============================================================================

  @Get("listed")
  async getListedVirtualEstates(
    @Res() res: Response,
    @Query("page") page = 1, // default to page 1
    @Query("size") size = 10, //default to size 10,
    @Query("sort") sort = "LATEST",
  ) {
    try {
      const virtualEstatesRes =
        await this.virtualEstateService.getListedVirtualEstates(
          page,
          size,
          sort,
        );

      if (!virtualEstatesRes) {
        res.status(HttpStatus.OK).json({
          success: true,
          virtualEstates: [],
          message: "No virtual estates listings",
        });
      }
      res.status(HttpStatus.OK).json({
        virtualEstates: plainToInstance(
          VirtualEstateResponseDto,
          virtualEstatesRes.virtualEstateListingsActive,
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

  @Get("transacted")
  async getTransactedVirtualEstates(
    @Res() res: Response,
    @Query("page") page = 1, // default to page 1
    @Query("size") size = 10, //default to size 10,
    @Query("sort") sort = "LATEST",
  ) {
    try {
      const virtualEstatesRes =
        await this.virtualEstateService.getTransactedVirtualEstates(
          page,
          size,
          sort,
        );

      res.status(HttpStatus.OK).json({
        virtualEstates: plainToInstance(
          VirtualEstateResponseDto,
          virtualEstatesRes.virtualEstates,
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

  @Get("search")
  async searchVirtualEstate(
    @Res() res: Response,
    @Query("page") page = 1, // default to page 1
    @Query("size") size = 10, //default to size 10,
    @Query("name") name,
  ) {
    try {
      const virtualEstates =
        await this.virtualEstateService.searchVirtualEstate(page, size, name);

      if (!virtualEstates) {
        res.status(HttpStatus.OK).json({
          success: true,
          virtualEstates: [],
          message: "No virtual estates listings",
        });
      }

      res.status(HttpStatus.OK).json({
        virtualEstates: plainToInstance(
          VirtualEstateResponseDto,
          virtualEstates,
          {
            excludeExtraneousValues: true,
          },
        ),
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

  // =============================================================================
  // My Virtual Estates
  // =============================================================================

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

  @Get("transactions")
  @UseGuards(KeycloakJwtGuard)
  async getAllTransactionRecordsForUserBasedOnType(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Query("side") side = "both", // default to both
    @Query("page") page = "1", // default to page 1
    @Query("size") size = "10", //default to size 10,
  ) {
    try {
      const transactionRecordsForUser =
        await this.virtualEstateTransactionRecordsService.getAllTransactionRecordsForUserBasedOnType(
          req.user.userID,
          side,
          parseInt(size),
          parseInt(page),
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
  // @UsePipes(new HexIdValidationPipe())
  async mintVirtualEstate(
    @Param("hexID", HexIdValidationPipe) hexID,
    @Req() req: AuthenticatedRequest,
    @Body("name") name: string,
    @Body("paymentPassword") paymentPassword: string,
  ) {
    try {
      await this.userService.checkPaymentPassword({
        userID: req.user.userID,
        password: paymentPassword,
      });

      const { ve: existing } =
        await this.virtualEstateService.getOneVirtualEstate(hexID);

      if (existing) {
        throw new HttpException(
          "Virtual Estate already minted",
          HttpStatus.BAD_REQUEST,
        );
      }

      const virtualEstate = await this.virtualEstateService.mintVirtualEstate({
        userID: req.user.userID, // keycloakID
        hexID,
        name,
      });

      return virtualEstate;
    } catch (err) {
      console.error(err);
      switch (err.code) {
        case "NOT_ENOUGH_BALANCE":
          throw new HttpException("Not enough balance", HttpStatus.FORBIDDEN);

        case "INVALID_PASSWORD":
          throw new HttpException(
            "Invalid payment password",
            HttpStatus.FORBIDDEN,
          );
      }

      throw new HttpException(
        "Internal Server Error",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // =============================================================================
  // Public Virtual Estates
  // =============================================================================

  @Get("latest")
  async getLatestVirtualEstates(
    @Res() res: Response,
    @Query("page") page = 1, // default to page 1
    @Query("size") size = 20, //default to size 20,
  ) {
    try {
      const virtualEstatesRes =
        await this.virtualEstateService.getLatestVirtualEstates(size, page);

      if (!virtualEstatesRes) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          virtualEstates: null,
          message: "No virtual estates found",
        });
      }

      res.status(HttpStatus.OK).json({
        virtualEstates: plainToInstance(
          VirtualEstateResponseDto,
          virtualEstatesRes.virtualEstates,
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
    @Query("totalMinted") totalMinted = "true",
    @Query("listings") listings = "true",
    @Query("transactionVolume") transactionVolume = "true",
    @Query("transactionCount") transactionCount = "true",
    @Query("startDate") startDate: string,
    @Query("endDate") endDate: string,
  ) {
    try {
      // TODO(Zawar): Add Redis Caching
      const start = startDate ? new Date(startDate) : new Date("30-oct-2023");
      const end = endDate ? new Date(endDate) : new Date();
      const responseObject: VirtualEstatesStatistics = {};

      if (totalMinted == "true") {
        responseObject.totalVirtualEstatesMinted =
          await this.virtualEstateService.getVirtualEstateTotalMinted(
            end,
            start,
          );
      }

      if (listings == "true") {
        responseObject.virtualEstateListingCount =
          await this.virtualEstateListingService.getVirtualEstateListingsCount(
            end,
            start,
          );
      }

      if (transactionVolume == "true") {
        responseObject.totalTransactionVolume =
          await this.virtualEstateTransactionRecordsService.getTotalTransactionVolume(
            end,
            start,
          );
      }

      if (transactionCount == "true") {
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

  @Get(":hexID")
  async getOneVirtualEstate(
    @Param("hexID") hexID,
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
  ) {
    try {
      const { ve: virtualEstate, listing } =
        await this.virtualEstateService.getOneVirtualEstate(hexID, {
          withListing: true,
        });

      if (!virtualEstate) {
        const mintPrice = await this.virtualEstateService.getMintPrice();

        res.status(HttpStatus.OK).json({
          mintPrice: mintPrice,
        });
        return;
      }

      res.status(HttpStatus.OK).json({
        ve: plainToInstance(VirtualEstateResponseDto, virtualEstate, {
          excludeExtraneousValues: true,
        }),
        listing: plainToInstance(VirtualEstateListingResponseDto, listing, {
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

  @Get(":hexID/in-cluster")
  async getClusterHexIDsInArea(
    @Param("hexID") hexID: string,
    @Query("depth") depth: number = 2,
    @Res() res: Response,
  ) {
    try {
      const cluster = await this.virtualEstateService.getClustersInArea({
        hexID,
        depth,
      });

      res.status(HttpStatus.OK).json({ cluster });
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

  // =============================================================================
  // Trading Virtual Estates
  // =============================================================================

  @UseGuards(KeycloakJwtGuard)
  @Patch(":hexID/bid/:bidID/accept")
  async acceptBidToSellVirtualEstate(
    @Param("hexID") hexID,
    @Param("bidID") bidID,
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Body("paymentPassword") paymentPassword: string,
  ) {
    try {
      await this.userService.checkPaymentPassword({
        userID: req.user.userID,
        password: paymentPassword,
      });

      const sellerID = req.user.userID;

      const { ve: virtualEstate } =
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

      switch (error.code) {
        case "BID_NOT_FOUND":
          throw new HttpException(
            {
              message: "bid not found",
            },
            HttpStatus.NOT_FOUND,
          );
        case "INVALID_BID_TYPE":
          throw new HttpException(
            {
              message: "bid type is invalid",
            },
            HttpStatus.BAD_REQUEST,
          );
      }

      throw new HttpException(
        "Internal Server Error",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(KeycloakJwtGuard)
  @Patch(":hexID/ask/:askID/accept")
  async acceptAskToBuyVirtualEstate(
    @Param("hexID") hexID,
    @Param("askID") askID,
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Body("paymentPassword") paymentPassword: string,
  ) {
    try {
      await this.userService.checkPaymentPassword({
        userID: req.user.userID,
        password: paymentPassword,
      });

      const buyerID = req.user.userID;

      const transactionRecord =
        await this.virtualEstateTransactionRecordsService.acceptAskRequestToBuyVirtualEstate(
          {
            virtualEstateID: hexID,
            buyerID,
            askID,
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
      commonControllerErrorHandler(error.code);
    }
  }

  @UseGuards(KeycloakJwtGuard)
  @Post(":hexID/transfer")
  async transferVirtualEstate(
    @Param("hexID") hexID,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
    @Body("paymentPassword") paymentPassword: string,
  ) {
    try {
      await this.userService.checkPaymentPassword({
        userID: req.user.userID,
        password: paymentPassword,
      });

      const ownerID = req.user.userID;
      const receiverID = req.body.receiverID;
      const transactionRecord =
        await this.virtualEstateService.transferVirtualEstate(
          hexID,
          receiverID,
          ownerID,
        );

      if (!transactionRecord)
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Virtual estate not transfer not successful",
        });

      res.status(HttpStatus.OK).json({
        success: true,
        data: transactionRecord,
        message: "Virtual estate transferred successfully",
      });
    } catch (err) {
      commonControllerErrorHandler(err.code);
    }
  }
}
