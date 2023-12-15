import { Module } from "@nestjs/common";

import { AccountService } from "../account/account.service";
import { PrismaService } from "../lib/prisma/prisma.service";
import { VirtualEstateController } from "./virtual-estate.controller";
import { VirtualEstateService } from "./virtual-estate.service";

@Module({
  controllers: [VirtualEstateController],
  providers: [VirtualEstateService, PrismaService, AccountService],
})
export class VirtualEstateModule {}
