import { Module } from "@nestjs/common";

import { PrismaService } from "../lib/prisma/prisma.service";
import { WithdrawController } from "../withdraw/withdraw.controller";
import { TransactionAdminController } from "./transaction/transaction-admin.controller";
import { TransactionAdminService } from "./transaction/transaction-admin.service";
import { UserAdminController } from "./user/user-admin.controller";
import { UserAdminService } from "./user/user-admin.service";
import { VirtualEstateAdminController } from "./virtual-estate/virtual-estate-admin.controller";
import { VirtualEstateAdminService } from "./virtual-estate/virtual-estate-admin.service";
import { WithdrawRequestAdminController } from "./withdraw-request/withdraw-request-admiin.controller";
import { WithdrawRequestAdminService } from "./withdraw-request/withdraw-request-admin.service";

@Module({
  controllers: [
    VirtualEstateAdminController,
    TransactionAdminController,
    UserAdminController,
    WithdrawRequestAdminController,
  ],
  providers: [
    PrismaService,
    VirtualEstateAdminService,
    TransactionAdminService,
    UserAdminService,
    WithdrawRequestAdminService,
  ],
})
export class AdminAPIModule {}
