import { Decimal } from "@prisma/client/runtime/library";

import { Injectable } from "@nestjs/common";

import { PrismaService } from "../lib/prisma/prisma.service";
import { ZERO_DECIMAL } from "../lib/prisma/utils/zerro-decimal";
import { RechargeRecordResponseDto } from "./dto/rechargeRecords.dto";

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}

  async getMyBalance({ userID }: { userID: string }): Promise<Decimal> {
    console.log("userID", userID);
    const totalBalance = await this.prisma.rechargeRecords.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        ownerID: userID,
      },
    });
    console.log("totalBalance", totalBalance);

    const balance = totalBalance._sum.amount || ZERO_DECIMAL;

    return balance;
  }

  async getMyAllRechargeRecords(
    userId: string,
    size: number,
    page: number,
  ): Promise<{ records: RechargeRecordResponseDto[]; totalCount: number }> {
    const query = {
      ownerID: userId,
    };

    try {
      const rechargeRecords = await this.prisma.rechargeRecords.findMany({
        where: query,
        take: size,
        skip: (page - 1) * size,
      });

      const totalCount = await this.prisma.rechargeRecords.count({
        where: query,
      });

      return { records: rechargeRecords, totalCount };
    } catch (error) {
      throw new Error("Internal Server Error");
    }
  }

  async updateWalletAddress(userId: string, walletAddress: string) {
    try {
      const user = await this.prisma.user.update({
        where: {
          keycloakID: userId,
        },
        data: {
          piWalletAddress: walletAddress,
        },
      });
      return user;
    } catch (error) {
      throw new Error("Internal Server Error");
    }
  }
}
