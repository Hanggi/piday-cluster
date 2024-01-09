import Redis from "ioredis";

import { HttpService } from "@nestjs/axios";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";

import { PrismaService } from "../lib/prisma/prisma.service";

const PI_NETWORK_PAYMENT_ID_CURSOR = "piday-server::externalIdCursor";

@Injectable()
export class TasksService {
  private readonly pageSize = 100; // Adjust the page size as needed

  constructor(
    private readonly httpService: HttpService,
    private readonly prismaService: PrismaService,
    @Inject("REDIS_CLIENT") readonly redis: Redis,
  ) {}

  private readonly logger = new Logger(TasksService.name);

  @Cron(CronExpression.EVERY_10_SECONDS)
  async AddRechargeRecordCron() {
    this.logger.debug("Called every 10 seconds");

    const cursor = await this.redis.get(PI_NETWORK_PAYMENT_ID_CURSOR);
    console.log("cursor:", cursor);

    const payments = await this.getAllAccountPayments(cursor);

    for (const payment of payments) {
      // Check if the payment has already been processed
      const existingRechargeRecord =
        await this.prismaService.rechargeRecords.findFirst({
          where: {
            externalID: payment.id.toString(),
          },
        });

      console.log(payment);

      if (existingRechargeRecord) {
        console.log(
          `Payment with ID ${payment.id} already processed. Skipping.`,
        );
        continue;
      }

      // Find the user associated with the payment
      const user = await this.prismaService.user.findFirst({
        where: {
          piWalletAddress: payment.from,
        },
      });

      if (!user) {
        console.log(
          `User with piWalletAddress ${payment.from} not found. Skipping.`,
        );
        continue;
      }

      this.prismaService.$transaction(async (prisma) => {
        // Create a recharge record
        const rechargeRecord = await prisma.rechargeRecords.create({
          data: {
            amount: parseFloat(payment.amount),
            reason: "RECHARGE_FROM_PI_NETWORK_TRANSFER", // You may adjust this as needed
            externalID: payment.id.toString(),
            ownerID: user.keycloakID,
          },
        });

        if (rechargeRecord) {
          await this.redis.set(
            PI_NETWORK_PAYMENT_ID_CURSOR,
            payment.id.toString(),
          );
        }

        console.log(
          `Recharge record created for user ${user.username} with amount ${payment.amount}`,
        );
      });
    }
  }

  async getAllAccountPayments(cursor?: string) {
    let url = `${process.env.GET_ACCOUNT_PAYMENTS_URL}/${process.env.RECHARGING_ADDRESS}/payments?limit=${this.pageSize}`;
    if (cursor) {
      url += `&cursor=${cursor}`;
    }
    const payments = await this.httpService.axiosRef.get(url);
    if (payments) {
      return payments.data?._embedded?.records?.filter(
        (singleRecord: any) => singleRecord.type === "payment",
      );
    }

    return [];
  }
}
