import { Module } from "@nestjs/common";

import { PrismaService } from "../lib/prisma/prisma.service";
import { VirtualEstateTransactionRecordsController } from "./virtual-estate-transaction-records.controller";
import { VirtualEstateTransactionRecordsService } from "./virtual-estate-transaction-records.service";
import { VirtualEstateListingService } from "../virtual-estate-listing/virtual-estate-listing.service";

@Module({
  controllers: [VirtualEstateTransactionRecordsController],
  providers: [VirtualEstateTransactionRecordsService, PrismaService, VirtualEstateListingService],
})
export class VirtualEstateTransactionRecordsModule {}
