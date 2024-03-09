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
}
