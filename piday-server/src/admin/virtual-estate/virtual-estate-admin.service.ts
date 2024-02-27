import { PrismaService } from "@/src/lib/prisma/prisma.service";

import { Injectable } from "@nestjs/common";

@Injectable()
export class VirtualEstateAdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getVirtualEstateList({
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
    const virtualEstates = await this.prisma.virtualEstate.findMany({
      take: size,
      skip: (page - 1) * size,
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: {
        owner: true,
      },
    });

    return virtualEstates;
  }
}
