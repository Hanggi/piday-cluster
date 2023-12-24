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
    const { bidID, sellerID, virtualEstateID } =
      createVirtualEstateTransactionRecordDto;
    const biddingDetail =
      await this.virtualEstateListingService.getOneListingDetail(bidID);
    if (!biddingDetail) {
      throw new Error("No bidding details found.");
    }
    const buyerID = biddingDetail.ownerID;
    const price = biddingDetail.price.toString();
    const transactionID = BigInt(generateFlakeID());
    const balance = await this.prisma.rechargeRecords.aggregate({
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

    const transaction =
      await this.prisma.virtualEstateTransactionRecords.create({
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

    const updateOwner = await this.prisma.virtualEstate.update({
      data: {
        ownerID: buyerID,
      },
      where: {
        virtualEstateID,
      },
    });
    // TODO(): charge recharge records of both buyers and sellers
    return {
      ...transaction,
      transactionID: transaction.transactionID.toString(),
    };
  }
}
