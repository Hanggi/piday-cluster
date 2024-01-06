import { HttpService } from "@nestjs/axios";
import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";

import { PrismaService } from "../lib/prisma/prisma.service";

@Injectable()
export class TasksService {
  private readonly pageSize = 100; // Adjust the page size as needed

  constructor(
    private readonly httpService: HttpService,
    private readonly prismaService: PrismaService,
  ) {}

  private readonly logger = new Logger(TasksService.name);

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron() {
    this.logger.debug("Called every 10 seconds");

    var cursor: string | undefined = undefined;

    // Get the last processed externalID to continue from that point
    const lastProcessedRecord =
      await this.prismaService.rechargeRecords.findFirst({
        where: {
          reason: "RECHARGE_FROM_PI_NETWORK_TRANSFER",
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    if (lastProcessedRecord) {
      cursor = lastProcessedRecord.externalID;
    }

    const payments = await this.getAllAccountPayments(cursor);

    for (const payment of payments) {
      // Check if the payment has already been processed
      const existingRechargeRecord =
        await this.prismaService.rechargeRecords.findFirst({
          where: {
            externalID: payment.id.toString(),
          },
        });

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

      // Create a recharge record
      await this.prismaService.rechargeRecords.create({
        data: {
          amount: parseFloat(payment.amount),
          reason: "RECHARGE_FROM_PI_NETWORK_TRANSFER", // You may adjust this as needed
          externalID: payment.id.toString(),
          ownerID: user.keycloakID,
        },
      });

      console.log(
        `Recharge record created for user ${user.username} with amount ${payment.amount}`,
      );
    }
  }

  async getAllAccountPayments(cursor?: string) {
    let url = `https://api.testnet.minepi.com/accounts/${process.env.RECHARGING_ADDRESS}/payments?limit=${this.pageSize}&order=asc`;
    if (cursor) {
      url += `&cursor=${cursor}`;
    }

    console.log(url);
    const payments = await this.httpService.axiosRef.get(url);

    if (payments) {
      return payments.data?._embedded?.records?.filter(
        (singleRecord: any) => singleRecord.type === "payment",
      );
    }

    return [];
  }
}
