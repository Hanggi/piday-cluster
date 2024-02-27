import { PrismaService } from "@/src/lib/prisma/prisma.service";

import { Injectable } from "@nestjs/common";

@Injectable()
export class TransactionAdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getTransactionList({
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
    console.log(size);
    const transactions =
      await this.prisma.virtualEstateTransactionRecords.findMany({
        take: size,
        skip: (page - 1) * size,
        orderBy: {
          [sortBy]: sortOrder,
        },
        include: {
          buyer: true,
          seller: true,
        },
      });

    const totalCount =
      await this.prisma.virtualEstateTransactionRecords.count();

    return { transactions, totalCount };
  }
}
