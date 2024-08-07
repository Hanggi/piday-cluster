import { Decimal } from "@prisma/client/runtime/library";

import { Injectable } from "@nestjs/common";

import { ServiceException } from "../lib/exceptions/service-exception";
import { generateFlakeID } from "../lib/generate-id/generate-flake-id";
import { PrismaService } from "../lib/prisma/prisma.service";
import { WithdrawStatusEnum } from "./dto/createWithdrawRequest.dto";

@Injectable()
export class WithdrawService {
  constructor(private prisma: PrismaService) {}

  async createWithdrawRequest(amount: Decimal, userID: string) {
    const withdrawRequest = await this.prisma.$transaction(async (tx) => {
      const balance = await tx.rechargeRecords.aggregate({
        where: {
          ownerID: userID,
        },
        _sum: {
          amount: true,
        },
      });

      if (!balance._sum.amount || balance._sum.amount.lessThan(amount)) {
        throw new ServiceException("Not enough balance", "NOT_ENOUGH_BALANCE");
      }

      const withdrawStatusID = BigInt(generateFlakeID());
      const withdrawRequest = await tx.withdrawRequest.create({
        data: {
          status: WithdrawStatusEnum.PENDING,
          ownerID: userID,
          amount: amount,
          withdrawStatusID: withdrawStatusID,
        },
      });

      // Create a frozen balance record
      await tx.rechargeRecords.create({
        data: {
          ownerID: userID,
          amount: -amount,
          reason: "FROZEN_WITHDRAW",
          externalID: withdrawStatusID.toString(),
        },
      });

      return {
        ...withdrawRequest,
        withdrawStatusID: withdrawRequest.withdrawStatusID.toString(),
      };
    });

    return withdrawRequest;
  }

  async cancelWithdrawRequest(withdrawStatusID: string, userID: string) {
    const withdrawRequest = await this.prisma.withdrawRequest.findFirst({
      where: {
        withdrawStatusID: BigInt(withdrawStatusID),
      },
    });

    if (withdrawRequest.status === WithdrawStatusEnum.ACCEPTED) {
      throw new ServiceException(
        "Request can not be canceled already accepted",
        "CAN_NOT_BE_CANCELLED",
      );
    }
    // TODO(Hanggi): Check user ID

    return await this.prisma.$transaction(async (tx) => {
      const updatedRequest = await tx.withdrawRequest.update({
        data: {
          status: WithdrawStatusEnum.CANCELED,
        },
        where: {
          withdrawStatusID: BigInt(withdrawStatusID),
        },
      });

      // Add the amount back to the user's balance
      await tx.rechargeRecords.create({
        data: {
          ownerID: userID,
          amount: withdrawRequest.amount,
          reason: "CANCEL_WITHDRAW",
          externalID: withdrawStatusID,
        },
      });

      return updatedRequest;
    });
  }
}
