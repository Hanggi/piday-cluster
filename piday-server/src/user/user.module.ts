import { Module } from "@nestjs/common";

import { KeycloakService } from "../lib/keycloak/keycloak.service";
import { PrismaService } from "../lib/prisma/prisma.service";
import { RedisModule } from "../lib/redis/redis.module";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
  imports: [RedisModule],
  controllers: [UserController],
  providers: [UserService, PrismaService, KeycloakService],
})
export class UserModule {}
