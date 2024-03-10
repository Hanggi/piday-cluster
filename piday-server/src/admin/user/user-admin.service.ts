import {
  generateInvitationCode,
  getUserVisibleID,
} from "@/src/lib/generate-id/generate-user-id";
import { PrismaService } from "@/src/lib/prisma/prisma.service";
import { RechargeRecords } from "@prisma/client";

import { Injectable } from "@nestjs/common";

import { OrderByOptions, SortByOptions } from "../dto/admin.dto";

@Injectable()
export class UserAdminService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers(
    page: number,
    size: number,
    sort?: SortByOptions,
    order?: OrderByOptions,
    email?: string,
    username?: string,
    piAddress?: string,
    withBalance?: boolean,
  ) {
    const query = {};

    if (email) query["email"] = { contains: `%${email}%` };
    if (username) query["username"] = { contains: `%${username}%` };
    if (piAddress) query["piAddress"] = { contains: `%${piAddress}%` };

    const orderObj = {};
    if (sort && order) {
      orderObj[sort] = order;
    }

    console.log(withBalance);
    let users = await this.prisma.user.findMany({
      where: query,
      take: +size,
      skip: +((page === 0 ? 1 : page - 1) * size),
      orderBy: orderObj,
    });

    users.forEach((user) => {
      const visibleID = getUserVisibleID(user.id);
      (user as any).vid = visibleID;
    });
    console.log(users);

    if (withBalance) {
      const usersWithRechargeSums = await Promise.all(
        users.map(async (user) => {
          const rechargeSum = await this.prisma.rechargeRecords.aggregate({
            _sum: {
              amount: true,
            },
            where: {
              ownerID: user.keycloakID,
            },
          });

          return {
            ...user,
            balance: rechargeSum._sum.amount,
          };
        }),
      );

      users = usersWithRechargeSums;
    }

    const totalCount = await this.prisma.user.count({
      where: query,
    });

    return { user: users, totalCount: totalCount };
  }

  // General Ledger
  async getGeneralLedger() {
    const user = await this.prisma.user.findUnique({
      where: {
        keycloakID: process.env.PLATFORM_ACCOUNT_ID,
      },
    });
    const inviteCode = generateInvitationCode(user.id);
    console.log(inviteCode);

    const rechargeSumPromise = this.prisma.rechargeRecords.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        ownerID: process.env.PLATFORM_ACCOUNT_ID,
      },
    });

    const totalUserCountPromise = this.prisma.user.count();
    const totalVECountPromise = this.prisma.virtualEstate.count();
    const totalTransactionCountPromise =
      this.prisma.virtualEstateTransactionRecords.count();

    const transactionAmountSumPromise =
      this.prisma.virtualEstateTransactionRecords.aggregate({
        _sum: {
          price: true,
        },
      });

    const rechargeSumByGenesisMintPromise =
      this.prisma.rechargeRecords.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          reason: "PLATFORM_MINT_VIRTUAL_ESTATE",
        },
      });
    const rechargeSumByTradingCommissionPromise =
      this.prisma.rechargeRecords.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          reason: "TRADING_COMMISSION",
        },
      });

    const [
      generalBalance,
      totalUserCount,
      totalVirtualEstates,
      totalTransactionCount,
      transactionAmountSum,

      rechargeSumByGenesisMint,
      rechargeSumByTradingCommission,
    ] = await Promise.all([
      rechargeSumPromise,
      totalUserCountPromise,
      totalVECountPromise,
      totalTransactionCountPromise,
      transactionAmountSumPromise,
      rechargeSumByGenesisMintPromise,
      rechargeSumByTradingCommissionPromise,
    ]);

    return {
      generalBalance: generalBalance._sum.amount,
      totalUsers: totalUserCount,
      totalVirtualEstates: totalVirtualEstates,
      totalTransactions: totalTransactionCount,
      totalTransactionAmount: transactionAmountSum._sum.price,
      inviteCode,

      incomeByGenesisMint: rechargeSumByGenesisMint._sum.amount,
      incomeByTradingCommission: rechargeSumByTradingCommission._sum.amount,
    };
  }

  async getLedgerRecords({
    size,
    page,
  }: {
    size: number;
    page: number;
  }): Promise<{ records: RechargeRecords[]; totalCount: number }> {
    console.log({
      take: +size,
      skip: +(page - 1) * size,
    });
    const records = await this.prisma.rechargeRecords.findMany({
      where: {
        ownerID: process.env.PLATFORM_ACCOUNT_ID,
      },
      take: +size,
      skip: +(page - 1) * size,
      orderBy: {
        createdAt: "desc",
      },
    });

    const totalCount = await this.prisma.rechargeRecords.count({
      where: {
        ownerID: process.env.PLATFORM_ACCOUNT_ID,
      },
    });

    return {
      records,
      totalCount,
    };
  }
}
