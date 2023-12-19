import { Module } from "@nestjs/common";

import { AccountService } from "../account/account.service";
import { PrismaService } from "../lib/prisma/prisma.service";
import { VirtualEstateListingController } from "./virtual-estate-listing.controller";
import { VirtualEstateListingService } from "./virtual-estate-listing.service";

@Module({
  controllers: [VirtualEstateListingController],
  providers: [VirtualEstateListingService, PrismaService, AccountService],
})
export class VirtualEstateListingModule {}
