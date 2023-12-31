import { Decimal } from "@prisma/client/runtime/library";

import { Injectable } from "@nestjs/common";

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
  async acceptBidToSellVirtualEstate(
    createVirtualEstateTransactionRecordDto: CreateVirtualEstateTransactionRecordDto,
  ) {
    return this.prisma.$transaction(async (prisma) => {
      const { bidID, sellerID, virtualEstateID } =
        createVirtualEstateTransactionRecordDto;
      const biddingDetail =
        await this.virtualEstateListingService.getOneListingDetail(bidID);
      if (!biddingDetail) {
        throw new Error("No bidding details found.");
      }
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
        throw new Error("Not enough balance");
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

      const sellerRechargeRecords = await prisma.rechargeRecords.create({
        data: {
          amount: price,
          externalID: transactionID.toString(),
          reason: "SELL_ASK",
          ownerID: sellerID,
        },
      });
      const buyerRechargeRecords = await prisma.rechargeRecords.create({
        data: {
          amount: -price,
          externalID: transactionID.toString(),
          reason: "BUY_BID",
          ownerID: buyerID,
        },
      });

      const updateOwner = await prisma.virtualEstate.update({
        data: {
          ownerID: buyerID,
        },
        where: {
          virtualEstateID,
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
}
