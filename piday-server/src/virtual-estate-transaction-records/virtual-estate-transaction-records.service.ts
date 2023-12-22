import { Injectable } from "@nestjs/common";

import { PrismaService } from "../lib/prisma/prisma.service";
import { createFlakeGenID } from "../lib/utils/create-flake-gen-id";
import { CreateVirtualEstateTransactionRecordDto } from "./dto/create-virtual-estate-transaction-record.dto";

@Injectable()
export class VirtualEstateTransactionRecordsService {
  constructor(private prisma: PrismaService) {}
  async sellVirtualEstate(
    createVirtualEstateTransactionRecordDto: CreateVirtualEstateTransactionRecordDto,
  ) {
    console.log(createVirtualEstateTransactionRecordDto);

    // TO DO check buyer recharge records and compare them with price
    const transaction =
      await this.prisma.virtualEstateTransactionRecords.create({
        data: {
          transactionID: createFlakeGenID(),
          ...createVirtualEstateTransactionRecordDto,
        },
      });

    return {
      ...transaction,
      transactionID: transaction.transactionID.toString(),
    };
  }
}
