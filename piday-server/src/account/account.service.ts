import { Decimal } from "@prisma/client/runtime/library";

import { Injectable } from "@nestjs/common";

import { ServiceException } from "../lib/exceptions/service-exception";
import { generateFlakeID } from "../lib/generate-id/generate-flake-id";
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
  ): Promise<{ records: RechargeRecordResponseDto[]; totalCount: number }> {
    const query = {
      ownerID: userId,
    };

    try {
      const rechargeRecords = await this.prisma.rechargeRecords.findMany({
        where: query,
        take: size,
        skip: (page - 1) * size,
        orderBy: {
          createdAt: "desc",
        },
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

  async transferAmount(userID: string, to: string, amount: string) {
    const rechargeRecord = await this.prisma.$transaction(async (tx) => {
      const externalID = generateFlakeID();
      const balance = await tx.rechargeRecords.aggregate({
        where: {
          ownerID: userID,
        },
        _sum: {
          amount: true,
        },
      });
      if (
        !balance._sum.amount ||
        balance._sum.amount.lessThan(new Decimal(amount))
      ) {
        throw new ServiceException("Not enough balance", "NOT_ENOUGH_BALANCE");
      }
      const receiver = await tx.user.findFirst({
        where: {
          OR: [
            {
              piWalletAddress: to,
            },
            {
              email: to,
            },
          ],
        },
      });

      if (!receiver) {
        throw new ServiceException(
          "In Valid Wallet Address",
          "IN_VALID_WALLET_ADDRESS",
        );
      }

      await tx.rechargeRecords.create({
        data: {
          ownerID: userID,
          reason: "TRANSFER_BALANCE",
          amount: -amount,
          externalID: externalID,
        },
      });

      const receiverRechargeRecord = await tx.rechargeRecords.create({
        data: {
          ownerID: receiver.keycloakID,
          reason: "RECEIVE_BALANCE",
          amount: amount,
          externalID: externalID,
        },
      });

      return receiverRechargeRecord;
    });

    return rechargeRecord;
  }
}
