import { Decimal } from "@prisma/client/runtime/library";

import { Injectable } from "@nestjs/common";

import { ServiceException } from "../lib/exceptions/service-exception";
import { generateFlakeID } from "../lib/generate-id/generate-flake-id";
import { PrismaService } from "../lib/prisma/prisma.service";
import { VirtualEstateListingService } from "../virtual-estate-listing/virtual-estate-listing.service";
import {
  AcceptAskRequestTransactionRecordDto,
  CreateVirtualEstateTransactionRecordDto,
} from "./dto/create-virtual-estate-transaction-record.dto";

@Injectable()
export class VirtualEstateTransactionRecordsService {
  constructor(
    private prisma: PrismaService,
    private virtualEstateListingService: VirtualEstateListingService,
  ) {}

  async acceptBidToSellVirtualEstate({
    bidID,
    sellerID,
    virtualEstateID,
  }: CreateVirtualEstateTransactionRecordDto) {
    const biddingDetail =
      await this.virtualEstateListingService.getOneListingDetail(BigInt(bidID));
    if (!biddingDetail) {
      throw new ServiceException("No bidding details found.", "BID_NOT_FOUND");
    }
    if (biddingDetail.type !== "BID") {
      throw new ServiceException("Invalid bid type.", "INVALID_BID_TYPE");
    }
    if (biddingDetail.expiresAt < new Date()) {
      throw new ServiceException("Bid expired.", "BID_EXPIRED");
    }

    return this.prisma.$transaction(async (prisma) => {
      const buyerID = biddingDetail.ownerID;
      const price = biddingDetail.price.toString();
      const balance = await prisma.rechargeRecords.aggregate({
        where: {
          ownerID: buyerID,
        },
        _sum: {
          amount: true,
        },
      });
      if (balance._sum.amount.lessThan(new Decimal(price))) {
        throw new ServiceException("Not enough balance", "NOT_ENOUGH_BALANCE");
      }

      const transactionID = BigInt(generateFlakeID());
      const transaction = await prisma.virtualEstateTransactionRecords.create({
        data: {
          transactionID: transactionID,
          buyerID,
          price,
          sellerID,
          virtualEstateID,
        },
      });

      if (!transaction) {
        throw new Error("Transaction not successful");
      }

      await prisma.rechargeRecords.create({
        data: {
          amount: price,
          externalID: transactionID.toString(),
          reason: "SELL_ASK",
          ownerID: sellerID,
        },
      });
      await prisma.rechargeRecords.create({
        data: {
          amount: -price,
          externalID: transactionID.toString(),
          reason: "BUY_BID",
          ownerID: buyerID,
        },
      });

      await prisma.virtualEstate.update({
        where: {
          virtualEstateID,
        },
        data: {
          ownerID: buyerID,
        },
      });
      const listingID = BigInt(bidID);
      await prisma.virtualEstateListing.update({
        where: {
          listingID,
        },
        data: {
          expiresAt: new Date(),
        },
      });

      return {
        ...transaction,
        transactionID: transaction.transactionID.toString(),
      };
    });
  }

  async getAllTransactionRecordsForUserBasedOnType(
    userID: string,
    type: string,
    size: number,
    page: number,
  ) {
    try {
      const whereClause = (() => {
        switch (type) {
          case "buyer":
            return { buyerID: userID };
          case "seller":
            return { sellerID: userID };
          default:
            return {
              OR: [{ buyerID: userID }, { sellerID: userID }],
            };
        }
      })();
      const transactionRecordsForUser =
        await this.prisma.virtualEstateTransactionRecords.findMany({
          where: whereClause,
          include: {
            buyer: true,
            seller: true,
          },
          take: size,
          skip: (page - 1) * size,
          orderBy: {
            createdAt: "desc",
          },
        });
      return transactionRecordsForUser.map((singleTransactionRecords) => {
        return {
          ...singleTransactionRecords,
          transactionID: singleTransactionRecords.transactionID.toString(),
        };
      });
    } catch (error) {
      throw new Error("Internal Server");
    }
  }

  async getAllTransactionRecordsForVirtualEstate(
    hexID: string,
    size: number,
    page: number,
  ) {
    const transactionRecordsForVirtualEstate =
      await this.prisma.virtualEstateTransactionRecords.findMany({
        where: {
          virtualEstateID: hexID,
        },
        include: {
          buyer: true,
          seller: true,
        },
        take: size,
        skip: (page - 1) * size,
        orderBy: {
          createdAt: "desc",
        },
      });

    return transactionRecordsForVirtualEstate.map(
      (singleTransactionRecords) => {
        return {
          ...singleTransactionRecords,
          transactionID: singleTransactionRecords.transactionID.toString(),
        };
      },
    );
  }

  async getTotalTransactionVolume(endDate: Date, startDate: Date) {
    try {
      const totalTransactionVolume =
        await this.prisma.virtualEstateTransactionRecords.aggregate({
          where: {
            createdAt: { gte: startDate, lte: endDate },
          },
          _sum: {
            price: true,
          },
        });

      return totalTransactionVolume._sum.price;
    } catch (error) {
      throw error;
    }
  }

  async getVirtualEstateTransactionRecordsCount(
    endDate: Date,
    startDate: Date,
  ) {
    try {
      const virtualEstateTransactionRecords =
        await this.prisma.virtualEstateTransactionRecords.count({
          where: {
            createdAt: { gte: startDate, lte: endDate },
          },
        });

      return virtualEstateTransactionRecords;
    } catch (error) {
      throw error;
    }
  }

  async acceptAskRequestToBuyVirtualEstate({
    askID,
    buyerID,
    virtualEstateID,
  }: AcceptAskRequestTransactionRecordDto) {
    const askingDetail =
      await this.virtualEstateListingService.getOneListingDetail(BigInt(askID));
    if (!askingDetail) {
      throw new ServiceException("No asking details found.", "BID_NOT_FOUND");
    }
    if (askingDetail.type !== "ASK") {
      throw new ServiceException("Invalid ask type.", "INVALID_BID_TYPE");
    }
    if (askingDetail.expiresAt < new Date()) {
      throw new ServiceException("Ask expired.", "BID_EXPIRED");
    }

    return this.prisma.$transaction(async (prisma) => {
      const sellerID = askingDetail.ownerID;
      const price = askingDetail.price.toString();
      const balance = await prisma.rechargeRecords.aggregate({
        where: {
          ownerID: buyerID,
        },
        _sum: {
          amount: true,
        },
      });
      if (balance._sum.amount.lessThan(new Decimal(price))) {
        throw new ServiceException("Not enough balance", "NOT_ENOUGH_BALANCE");
      }

      const transactionID = BigInt(generateFlakeID());
      const transaction = await prisma.virtualEstateTransactionRecords.create({
        data: {
          transactionID: transactionID,
          buyerID,
          price,
          sellerID,
          virtualEstateID,
        },
      });

      if (!transaction) {
        throw new Error("Transaction not successful");
      }

      await prisma.rechargeRecords.create({
        data: {
          amount: price,
          externalID: transactionID.toString(),
          reason: "SELL_ASK",
          ownerID: sellerID,
        },
      });
      await prisma.rechargeRecords.create({
        data: {
          amount: -price,
          externalID: transactionID.toString(),
          reason: "BUY_BID",
          ownerID: buyerID,
        },
      });

      await prisma.virtualEstate.update({
        where: {
          virtualEstateID,
        },
        data: {
          ownerID: buyerID,
        },
      });
      const listingID = BigInt(askID);
      await prisma.virtualEstateListing.update({
        where: {
          listingID,
        },
        data: {
          expiresAt: new Date(),
        },
      });

      return {
        ...transaction,
        transactionID: transaction.transactionID.toString(),
      };
    });
  }
}
