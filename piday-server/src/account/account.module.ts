import { Module } from "@nestjs/common";

import { PrismaService } from "../lib/prisma/prisma.service";
import { AccountController } from "./account.controller";
import { AccountService } from "./account.service";

@Module({
  imports: [],
  controllers: [AccountController],
  providers: [AccountService, PrismaService],
})
export class AccountModule {}
