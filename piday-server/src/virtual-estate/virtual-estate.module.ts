import { Module } from "@nestjs/common";

import { AccountService } from "../account/account.service";
import { PrismaService } from "../lib/prisma/prisma.service";
import { VirtualEstateListingService } from "../virtual-estate-listing/virtual-estate-listing.service";
import { VirtualEstateTransactionRecordsService } from "../virtual-estate-transaction-records/virtual-estate-transaction-records.service";
import { VirtualEstateController } from "./virtual-estate.controller";
import { VirtualEstateService } from "./virtual-estate.service";

@Module({
  controllers: [VirtualEstateController],
  providers: [
    VirtualEstateService,
    PrismaService,
    AccountService,
    VirtualEstateListingService,
    VirtualEstateTransactionRecordsService,
  ],
})
export class VirtualEstateModule {}
