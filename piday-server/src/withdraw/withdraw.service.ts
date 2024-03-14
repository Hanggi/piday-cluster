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

      const pendingWithdrawalRequestsAmount =
        await tx.withdrawRequest.aggregate({
          where: {
            AND: [{ ownerID: userID }, { status: "PENDING" }],
          },
          _sum: {
            amount: true,
          },
        });

      // Balance after subtracting pending withdrawel request balance from the total amount
      const remainingBalance = pendingWithdrawalRequestsAmount._sum.amount
        ? balance._sum.amount.sub(pendingWithdrawalRequestsAmount._sum.amount)
        : balance._sum.amount;

      if (!remainingBalance || remainingBalance.lessThan(amount)) {
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

    const updatedRequest = await this.prisma.withdrawRequest.update({
      data: {
        status: WithdrawStatusEnum.CANCELED,
      },
      where: {
        withdrawStatusID: BigInt(withdrawStatusID),
      },
    });

    return updatedRequest;
  }
}
