import { Decimal } from "@prisma/client/runtime/library";

import { Injectable } from "@nestjs/common";

import { ServiceException } from "../lib/exceptions/service-exception";
import { generateFlakeID } from "../lib/generate-id/generate-flake-id";
import { PrismaService } from "../lib/prisma/prisma.service";
import { VirtualEstateListingService } from "../virtual-estate-listing/virtual-estate-listing.service";
import { CreateVirtualEstateTransactionRecordDto } from "./dto/create-virtual-estate-transaction-record.dto";

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
      if (balance._sum.amount < new Decimal(price)) {
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
      await prisma.virtualEstateListing.updateMany({
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

  async getVirtualEstateTransactionRecordsCount(endDate: Date, startDate: Date) {
    try {
      const virtualEstateTransactionRecords = await this.prisma.virtualEstateTransactionRecords.count({
        where: {
          createdAt: { gte: startDate, lte: endDate },
        },
      });

      return virtualEstateTransactionRecords
    } catch (error) {
      throw error;
    }
  }
}
