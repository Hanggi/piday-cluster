import { Decimal } from "@prisma/client/runtime/library";

import { Injectable } from "@nestjs/common";

import { PrismaService } from "../lib/prisma/prisma.service";
import { ZERO_DECIMAL } from "../lib/prisma/utils/zerro-decimal";
import { RechargeRecordResponseDto } from "./dto/rechargeRecords.dto";

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}

  async getMyBalance({ userID }: { userID: string }): Promise<Decimal> {
    const totalBalance = await this.prisma.rechargeRecords.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        ownerID: userID,
      },
    });

    const balance = totalBalance._sum.amount || ZERO_DECIMAL;

    return balance;
  }

  async getMyAllRechargeRecords(
    userId: string,
    size: number,
    page: number,
  ): Promise<RechargeRecordResponseDto[]> {
    try {
      const rechargeRecords = await this.prisma.rechargeRecords.findMany({
        where: {
          ownerID: userId,
        },
        take: size,
        skip: (page - 1) * size,
      });
      return rechargeRecords;
    } catch (error) {
      throw new Error("Internal Server Error");
    }
  }
}
