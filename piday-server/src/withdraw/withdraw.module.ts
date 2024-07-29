import { Module } from "@nestjs/common";

import { KeycloakService } from "../lib/keycloak/keycloak.service";
import { PrismaService } from "../lib/prisma/prisma.service";
import { UserService } from "../user/user.service";
import { WithdrawController } from "./withdraw.controller";
import { WithdrawService } from "./withdraw.service";

@Module({
  imports: [],
  controllers: [WithdrawController],
  providers: [WithdrawService, PrismaService, UserService, KeycloakService],
})
export class WithdrawModule {}
