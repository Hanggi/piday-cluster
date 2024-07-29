import { ServiceException } from "@/src/lib/exceptions/service-exception";
import { PrismaService } from "@/src/lib/prisma/prisma.service";
import { WithdrawStatusEnum } from "@/src/withdraw/dto/createWithdrawRequest.dto";

import { Injectable } from "@nestjs/common";

@Injectable()
export class WithdrawRequestAdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getWithdrawRequest({
    page = 1,
    size = 50,
    sortBy = "createdAt",
    sortOrder = "desc",
  }: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) {
    const withdrawRequests = await this.prisma.withdrawRequest.findMany({
      take: size,
      skip: (page - 1) * size,
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: {
        owner: true,
      },
      // where: {
      //   status: WithdrawStatusEnum.PENDING,
      // },
    });

    const totalCount = await this.prisma.withdrawRequest.count();

    return { withdrawRequests, totalCount };
  }

  async acceptWithdrawRequest(withdrawStatusID: string) {
    const updateWithdrawRequest = await this.prisma.$transaction(async (tx) => {
      const withdrawRequest = await tx.withdrawRequest.findFirst({
        where: {
          withdrawStatusID: BigInt(withdrawStatusID),
        },
      });

      if (!withdrawRequest) {
        throw new ServiceException("Request not found", "NOT_FOUND");
      }

      if (withdrawRequest.status !== "PENDING") {
        throw new ServiceException(
          "Request can not be accepted",
          "BAD_REQUEST",
        );
      }
      const balance = await tx.rechargeRecords.aggregate({
        where: {
          ownerID: withdrawRequest.ownerID,
        },
        _sum: {
          amount: true,
        },
      });

      if (
        !balance._sum.amount ||
        balance._sum.amount.lessThan(withdrawRequest.amount)
      ) {
        throw new ServiceException("Not enough balance", "NOT_ENOUGH_BALANCE");
      }

      // Update the FROZEN_WITHDRAW recrod status to WITHDRAW
      await tx.rechargeRecords.update({
        data: {
          reason: "WITHDRAW",
        },
        where: {
          unique_externalID_reason: {
            externalID: withdrawStatusID.toString(),
            reason: "FROZEN_WITHDRAW",
          },
        },
      });

      // await tx.rechargeRecords.create({
      //   data: {
      //     amount: -withdrawRequest.amount,
      //     externalID: withdrawRequest.withdrawStatusID.toString(),
      //     reason: "WITHDRAW",
      //     ownerID: withdrawRequest.ownerID,
      //   },
      // });

      const updateWithdrawRequest = await tx.withdrawRequest.update({
        data: {
          status: WithdrawStatusEnum.ACCEPTED,
        },
        where: {
          withdrawStatusID: BigInt(withdrawStatusID),
        },
      });

      return updateWithdrawRequest;
    });

    return updateWithdrawRequest;
  }

  async addPiTransactionIDToWithdrawRequest(
    piTransactionID: string,
    withdrawStatusID: string,
  ) {
    const updatedWithdrawRequest = await this.prisma.withdrawRequest.update({
      data: {
        piTransactionID: piTransactionID,
      },
      where: {
        withdrawStatusID: BigInt(withdrawStatusID),
      },
    });

    return updatedWithdrawRequest;
  }

  async cancelWithdrawRequest(withdrawStatusID: string) {
    return await this.prisma.$transaction(async (tx) => {
      const withdrawRequest = await this.prisma.withdrawRequest.update({
        data: {
          status: "CANCELED",
        },
        where: {
          withdrawStatusID: BigInt(withdrawStatusID),
        },
      });

      if (!withdrawRequest) {
        throw new ServiceException("Request not found", "NOT_FOUND");
      }

      // Add the amount back to the user's balance
      await tx.rechargeRecords.create({
        data: {
          ownerID: withdrawRequest.ownerID,
          amount: withdrawRequest.amount,
          reason: "REJECT_WITHDRAW",
          externalID: withdrawStatusID,
        },
      });

      return withdrawRequest;
    });
  }
}
