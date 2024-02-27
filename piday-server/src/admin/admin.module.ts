import { Module } from "@nestjs/common";

import { PrismaService } from "../lib/prisma/prisma.service";
import { TransactionAdminController } from "./transaction/transaction-admin.controller";
import { TransactionAdminService } from "./transaction/transaction-admin.service";
import { VirtualEstateAdminController } from "./virtual-estate/virtual-estate-admin.controller";
import { VirtualEstateAdminService } from "./virtual-estate/virtual-estate-admin.service";

@Module({
  controllers: [VirtualEstateAdminController, TransactionAdminController],
  providers: [
    PrismaService,
    VirtualEstateAdminService,
    TransactionAdminService,
  ],
})
export class AdminAPIModule {}
