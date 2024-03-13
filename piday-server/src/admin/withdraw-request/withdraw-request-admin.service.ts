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
    const virtualEstates = await this.prisma.withdrawRequest.findMany({
      take: size,
      skip: (page - 1) * size,
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: {
        owner: true,
      },
      where: {
        status: WithdrawStatusEnum.PENDING,
      },
    });

    const totalCount = await this.prisma.virtualEstate.count();

    return { virtualEstates, totalCount };
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

      const rechargeRecord = await tx.rechargeRecords.create({
        data: {
          amount: -withdrawRequest.amount,
          externalID: withdrawRequest.withdrawStatusID.toString(),
          reason: "WITHDRAW",
          ownerID: withdrawRequest.ownerID,
        },
      });

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
}
