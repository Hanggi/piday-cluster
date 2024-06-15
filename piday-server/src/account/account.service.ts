import { Decimal } from "@prisma/client/runtime/library";

import { Injectable } from "@nestjs/common";

import { ServiceException } from "../lib/exceptions/service-exception";
import { generateFlakeID } from "../lib/generate-id/generate-flake-id";
import { PrismaService } from "../lib/prisma/prisma.service";
import { ZERO_DECIMAL } from "../lib/prisma/utils/zerro-decimal";
import { getWhereClause } from "../lib/utils/rechargeRecordsReasonPairs";
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
        include: {
          owner: true,
        },
      });

      const totalCount = await this.prisma.rechargeRecords.count({
        where: query,
      });

      const combinedRecords = [];

      for (const record of rechargeRecords) {
        const externalID = record.externalID;
        const combinedRecord = {
          externalID,
          sender: null,
          receiver: null,
          reason: record.reason,
          amount: record.amount,
          createdAt: record.createdAt,
          id: record.id,
        };

        const isSender = record.amount.lessThan(0);
        const userType = isSender ? "sender" : "receiver";
        combinedRecord[userType] = {
          username: record.owner.username,
          avatar: record.owner.avatar,
          email: record.owner.email,
          createdAt: record.owner.createdAt,
          updatedAt: record.owner.updatedAt,
        };

        const where = getWhereClause(record, externalID);

        const relatedRecord = await this.prisma.rechargeRecords.findFirst({
          where: where,
          include: {
            owner: true,
          },
        });

        if (relatedRecord) {
          const relatedUserType = isSender ? "receiver" : "sender";
          combinedRecord[relatedUserType] = {
            username: relatedRecord.owner.username,
            avatar: relatedRecord.owner.avatar,
            email: relatedRecord.owner.email,
            createdAt: relatedRecord.owner.createdAt,
            updatedAt: relatedRecord.owner.updatedAt,
          };
        }

        combinedRecords.push(combinedRecord);
      }

      return { records: combinedRecords, totalCount };
    } catch (error) {
      throw new Error("Internal Server Error");
    }
  }

  async updateWalletAddress(userId: string, walletAddress: string) {
    const myUser = await this.prisma.user.findFirst({
      where: {
        keycloakID: userId,
      },
    });

    // Update wallet address once a month
    if (
      myUser.piWalletAddress &&
      myUser.piWalletAddressUpdatedAt &&
      new Date().getTime() - myUser.piWalletAddressUpdatedAt.getTime() <
        30 * 24 * 60 * 60 * 1000
    ) {
      throw new ServiceException(
        "You can only update your wallet address once a month",
        "UPDATE_WALLET_ADDRESS_LIMIT",
      );
    }

    try {
      const user = await this.prisma.user.update({
        where: {
          keycloakID: userId,
        },
        data: {
          piWalletAddress: walletAddress,
          piWalletAddressUpdatedAt: new Date(),
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
            {
              keycloakID: to,
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
