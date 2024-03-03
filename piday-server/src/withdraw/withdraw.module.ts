import { Module } from "@nestjs/common";

import { PrismaService } from "../lib/prisma/prisma.service";
import { WithdrawController } from "./withdraw.controller";
import { WithdrawService } from "./withdraw.service";

@Module({
  imports: [],
  controllers: [WithdrawController],
  providers: [WithdrawService, PrismaService],
})
export class WithdrawModule {}
