import { RedisModule } from "src/lib/redis/redis.module";

import { Module } from "@nestjs/common";
import { ThrottlerModule } from "@nestjs/throttler";

import { MailgunModule } from "../lib/mailgun/mailgun.module";
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
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
