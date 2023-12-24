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
      
      const sellerRechargeRecords =await prisma.rechargeRecords.create({
        data: {
          amount: price,
          externalID: transactionID.toString(),
          reason: "SELL_ASK",
          ownerID: sellerID,
        },
      });
      const buyerRechargeRecords =await prisma.rechargeRecords.create({
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
}
