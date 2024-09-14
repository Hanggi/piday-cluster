import { h3ToParent } from "h3-js";
import Redis from "ioredis";

import { HttpService } from "@nestjs/axios";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";

import { PrismaService } from "../lib/prisma/prisma.service";
import { acquireLock, releaseLock } from "./utils/redis-lock";

const PI_NETWORK_PAYMENT_ID_CURSOR = "piday-server::externalIdCursor";
const REDIS_LOCK_KEY = "piday-server::rechargeRecordCronLock";
const PI_NETWORK_TRANSACTION_SCAN_INTERVAL = 10; // In seconds

@Injectable()
export class TasksService {
  private readonly pageSize = 100; // Adjust the page size as needed

  constructor(
    private readonly httpService: HttpService,
    private readonly prismaService: PrismaService,
    @Inject("REDIS_CLIENT") readonly redis: Redis,
  ) {}

  private readonly logger = new Logger(TasksService.name);

  @Cron(CronExpression.EVERY_30_SECONDS)
  async AddRechargeRecordCron() {
    const hasLock = await acquireLock(
      this.redis,
      REDIS_LOCK_KEY,
      PI_NETWORK_TRANSACTION_SCAN_INTERVAL,
    );

    if (!hasLock) {
      console.info("Locked by another process. Skipping.");
      return;
    }

    const cursor = await this.redis.get(PI_NETWORK_PAYMENT_ID_CURSOR);

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
        console.info(
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

      await this.redis.set(PI_NETWORK_PAYMENT_ID_CURSOR, payment.id.toString());

      if (!user) {
        console.info(
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

        console.info(
          `Recharge record created for user ${user.username} with amount ${payment.amount}, externalID ${rechargeRecord.externalID}`,
        );
      });
    }

    await releaseLock(this.redis, REDIS_LOCK_KEY);
  }

  async getAllAccountPayments(cursor?: string) {
    let url = `${process.env.GET_ACCOUNT_PAYMENTS_URL}/${process.env.RECHARGING_ADDRESS}/payments?limit=${this.pageSize}`;
    if (cursor) {
      url += `&cursor=${cursor}`;
    }
    try {
      const payments = await this.httpService.axiosRef.get(url);
      if (payments) {
        return payments.data?._embedded?.records?.filter(
          (singleRecord: any) => singleRecord.type === "payment",
        );
      }
    } catch (err) {
      console.error(url);
      console.error(err.response.data);
    }

    return [];
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async generateClusterDepthAddress() {
    // get 100 VEs which have not been set depth indexes.
    const VEs = await this.prismaService.virtualEstate.findMany({
      where: {
        OR: [
          {
            depth2Index: null,
          },
          {
            depth4Index: null,
          },
          {
            depth6Index: null,
          },
          {
            depth8Index: null,
          },
          {
            depth10Index: null,
          },
        ],
      },
      take: 100,
    });

    // for each VE, get the depth index
    VEs.forEach(async (VE) => {
      const depth2Index = h3ToParent(VE.virtualEstateID, 2);
      const depth3Index = h3ToParent(VE.virtualEstateID, 3);
      const depth4Index = h3ToParent(VE.virtualEstateID, 4);
      const depth6Index = h3ToParent(VE.virtualEstateID, 6);
      const depth8Index = h3ToParent(VE.virtualEstateID, 8);
      const depth10Index = h3ToParent(VE.virtualEstateID, 10);
      // const depth12Index = h3ToParent(VE.virtualEstateID, 12);

      await this.prismaService.virtualEstate.update({
        where: {
          id: VE.id,
        },
        data: {
          depth2Index: depth2Index,
          // depth3Index: depth3Index,
          depth4Index: depth4Index,
          depth6Index: depth6Index,
          depth8Index: depth8Index,
          depth10Index: depth10Index,
          // depth12Index: depth12Index,
        },
      });
    });
  }
}
