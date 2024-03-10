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

  async getMyPointRecords({ userID }: { userID: string }) {
    const pointRecords = await this.prisma.pointRecords.findMany({
      where: {
        ownerID: userID,
      },
    });

    return pointRecords;
  }

  // Check In
  async checkIn({ userID }: { userID: string }) {
    // TODO(Hanggi): calculate the amount of point based on the formula of minging
    const checkIn = await this.prisma.pointRecords.create({
      data: {
        amount: 100,
        ownerID: userID,
        reason: "CHECK_IN",
      },
    });

    return checkIn;
  }

  // Checked in today
  async checkedInToday({ userID }: { userID: string }) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkIn = await this.prisma.pointRecords.findFirst({
      where: {
        ownerID: userID,
        reason: "CHECK_IN",
        createdAt: {
          gte: today,
        },
      },
    });

    return checkIn;
  }
}
