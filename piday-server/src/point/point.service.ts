import { Decimal } from "@prisma/client/runtime/library";

import { Injectable } from "@nestjs/common";

import { PrismaService } from "../lib/prisma/prisma.service";

@Injectable()
export class PointService {
  constructor(private prisma: PrismaService) {}

  async getMyPoint({ userID }: { userID: string }): Promise<Decimal> {
    const totalPoint = await this.prisma.pointRecords.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        ownerID: userID,
      },
    });

    const point = totalPoint._sum.amount;

    return point;
  }
}
