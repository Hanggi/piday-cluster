import { Module, ValidationPipe } from "@nestjs/common";
import { APP_FILTER, APP_PIPE } from "@nestjs/core";
import { ScheduleModule } from "@nestjs/schedule";
import { ThrottlerModule } from "@nestjs/throttler";

import { AccountModule } from "./account/account.module";
import { AdminAPIModule } from "./admin/admin.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { LeaderBoardModule } from "./leaderboard/leaderboard.module";
import { HttpExceptionFilter } from "./lib/exceptions/http-exception.filter";
import { PointModule } from "./point/point.module";
import { TaskModule } from "./task/task.module";
import { UserModule } from "./user/user.module";
import { VirtualEstateListingModule } from "./virtual-estate-listing/virtual-estate-listing.module";
import { VirtualEstateTransactionRecordsModule } from "./virtual-estate-transaction-records/virtual-estate-transaction-records.module";
import { VirtualEstateModule } from "./virtual-estate/virtual-estate.module";
import { WithdrawModule } from "./withdraw/withdraw.module";

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100,
      },
    ]),

    // Logic Modules
    AuthModule,
    AccountModule,
    VirtualEstateModule,
    VirtualEstateListingModule,
    VirtualEstateTransactionRecordsModule,
    UserModule,
    ScheduleModule.forRoot(),
    TaskModule,
    WithdrawModule,
    PointModule,
    LeaderBoardModule,
    AdminAPIModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
