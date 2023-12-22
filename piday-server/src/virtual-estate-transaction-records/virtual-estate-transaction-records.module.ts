import { Module } from "@nestjs/common";

import { PrismaService } from "../lib/prisma/prisma.service";
import { VirtualEstateTransactionRecordsController } from "./virtual-estate-transaction-records.controller";
import { VirtualEstateTransactionRecordsService } from "./virtual-estate-transaction-records.service";

@Module({
  controllers: [VirtualEstateTransactionRecordsController],
  providers: [VirtualEstateTransactionRecordsService, PrismaService],
})
export class VirtualEstateTransactionRecordsModule {}
