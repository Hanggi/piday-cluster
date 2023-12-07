import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";

import { KeycloakModule } from "../lib/keycloak/keycloak.module";
import { MailgunModule } from "../lib/mailgun/mailgun.module";
import { PrismaService } from "../lib/prisma/prisma.service";
import { RedisModule } from "../lib/redis/redis.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 10,
      },
    ]),
    RedisModule,
    MailgunModule,
    KeycloakModule,
  ],
  controllers: [AuthController],
  providers: [
    PrismaService,
    AuthService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AuthModule {}
