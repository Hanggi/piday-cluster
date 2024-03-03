import { Decimal } from "@prisma/client/runtime/library";

import { Injectable } from "@nestjs/common";

import { ServiceException } from "../lib/exceptions/service-exception";
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

      const remainingBalanceAfterSubtractingPendingWithdrawelRequestBalance =
        pendingWithdrawalRequestsAmount._sum.amount
          ? balance._sum.amount.sub(pendingWithdrawalRequestsAmount._sum.amount)
          : balance._sum.amount;

      if (
        remainingBalanceAfterSubtractingPendingWithdrawelRequestBalance.lessThan(
          amount,
        )
      ) {
        throw new ServiceException("Not enough balance", "NOT_ENOUGH_BALANCE");
      }

      const withdrawRequest = await tx.withdrawRequest.create({
        data: {
          status: WithdrawStatusEnum.PENDING,
          ownerID: userID,
          amount: amount,
        },
      });

      return withdrawRequest;
    });

    return withdrawRequest;
  }

  async cancelWithdrawRequest(reqID: number, userID: string) {
    const withdrawRequest = await this.prisma.withdrawRequest.findFirst({
      where: {
        id: reqID,
      },
    });

    if (withdrawRequest.status === WithdrawStatusEnum.ACCEPTED) {
      throw new ServiceException(
        "Request can not be canceled already accepted",
        "CAN_NOT_BE_CANCELLED",
      );
    }

    const updatedRequest = await this.prisma.withdrawRequest.update({
      data: {
        status: WithdrawStatusEnum.CANCELED,
      },
      where: {
        id: reqID,
      },
    });

    return updatedRequest;
  }
}
