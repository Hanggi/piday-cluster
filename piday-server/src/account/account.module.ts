import { Module } from "@nestjs/common";

import { KeycloakService } from "../lib/keycloak/keycloak.service";
import { PrismaService } from "../lib/prisma/prisma.service";
import { AccountController } from "./account.controller";
import { AccountService } from "./account.service";

@Module({
  imports: [],
  controllers: [AccountController],
  providers: [AccountService, PrismaService, KeycloakService],
})
export class AccountModule {}
