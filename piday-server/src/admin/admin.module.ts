import { Module } from "@nestjs/common";

import { PrismaService } from "../lib/prisma/prisma.service";
import { TransactionAdminController } from "./transaction/transaction-admin.controller";
import { TransactionAdminService } from "./transaction/transaction-admin.service";
import { UserAdminController } from "./user/user-admin.controller";
import { UserAdminService } from "./user/user-admin.service";
import { VirtualEstateAdminController } from "./virtual-estate/virtual-estate-admin.controller";
import { VirtualEstateAdminService } from "./virtual-estate/virtual-estate-admin.service";

@Module({
  controllers: [
    VirtualEstateAdminController,
    TransactionAdminController,
    UserAdminController,
  ],
  providers: [
    PrismaService,
    VirtualEstateAdminService,
    TransactionAdminService,
    UserAdminService,
  ],
})
export class AdminAPIModule {}
