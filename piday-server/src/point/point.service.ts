import { Decimal } from "@prisma/client/runtime/library";

import { Injectable } from "@nestjs/common";

import { ServiceException } from "../lib/exceptions/service-exception";
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

    return point || new Decimal(0);
  }

  async getMyPointRecords({
    userID,
    page,
    size,
  }: {
    userID: string;
    page: number;
    size: number;
  }) {
    const pointRecords = await this.prisma.pointRecords.findMany({
      where: {
        ownerID: userID,
      },
      take: size,
      skip: (page - 1) * size,
      orderBy: {
        createdAt: "desc",
      },
    });
    const totalCount = await this.prisma.pointRecords.count({
      where: {
        ownerID: userID,
      },
    });

    return { pointRecords, totalCount };
  }

  // Check In
  //   个人100/每日
  //   邀请一人20/每日
  // 创世300/每日
  // 黄金200/每日
  // 白银150/每日
  // 南极100/每日
  // 所有数值都以人数为准，人数10倍后积分减半。
  async checkIn({ userID }: { userID: string }) {
    const alreadyCheckedInToday = await this.checkedInToday({ userID });
    if (alreadyCheckedInToday) {
      throw new ServiceException(
        "Already checked in today",
        "ALREADY_CHECKED_IN_TODAY",
      );
    }

    const myUser = await this.prisma.user.findUnique({
      where: {
        keycloakID: userID,
      },
      select: {
        id: true, // 仅选择ID
        inviterID: true,
      },
    });

    const userTotalCount = await this.prisma.user.count({});
    const invitedUserCount = await this.prisma.user.count({
      where: {
        inviterID: myUser.id,
      },
    });
    // const myVirtualEstateCount = await this.prisma.virtualEstate.count({
    //   where: {
    //     ownerID: userID,
    //     isGenesis: true,
    //   },
    // });
    // const myAntarcticEstateCount = await this.prisma.virtualEstate.count({
    //   where: {
    //     ownerID: userID,
    //     level: "ANTARCTIC",
    //   },
    // });
    // const myGoldenEstateCount = await this.prisma.virtualEstate.count({
    //   where: {
    //     ownerID: userID,
    //     level: "GOLDEN",
    //   },
    // });

    const [myVirtualEstateCount, myAntarcticEstateCount, myGoldenEstateCount] =
      await Promise.all([
        this.prisma.virtualEstate.count({
          where: {
            ownerID: userID,
            isGenesis: true,
          },
        }),
        this.prisma.virtualEstate.count({
          where: {
            ownerID: userID,
            level: "ANTARCTICA",
          },
        }),
        this.prisma.virtualEstate.count({
          where: {
            ownerID: userID,
            level: "GOLDEN",
          },
        }),
      ]);

    let checkInPoint = 0;
    let virtualEstatePoint = 0;
    let invitedUserPoint = 0;
    let antarcticEstatePoint = 0;
    let goldenVEPoint = 0;

    if (userTotalCount < 10_000) {
      checkInPoint += 100;
      invitedUserPoint += (invitedUserCount + 1) * 20;

      virtualEstatePoint += myVirtualEstateCount * 300;
      goldenVEPoint += myGoldenEstateCount * 200;
      antarcticEstatePoint += myAntarcticEstateCount * 100;
    } else if (userTotalCount < 100_000) {
      checkInPoint += 50;
      invitedUserPoint += (invitedUserCount + 1) * 10;

      virtualEstatePoint += myVirtualEstateCount * 150;
      goldenVEPoint += myGoldenEstateCount * 100;
      antarcticEstatePoint += myAntarcticEstateCount * 50;
    } else if (userTotalCount < 1_000_000) {
      checkInPoint += 25;
      invitedUserPoint += (invitedUserCount + 1) * 5;

      virtualEstatePoint += myVirtualEstateCount * 75;
      goldenVEPoint += myGoldenEstateCount * 50;
      antarcticEstatePoint += myAntarcticEstateCount * 25;
    } else if (userTotalCount < 5_000_000) {
      checkInPoint += 12.5;
      invitedUserPoint += (invitedUserCount + 1) * 2.5;

      virtualEstatePoint += myVirtualEstateCount * 37.5;
      goldenVEPoint += myGoldenEstateCount * 25;
      antarcticEstatePoint += myAntarcticEstateCount * 12.5;
    } else if (userTotalCount < 10_000_000) {
      checkInPoint += 6.25;
      invitedUserPoint += (invitedUserCount + 1) * 1.25;

      virtualEstatePoint += myVirtualEstateCount * 18.75;
      goldenVEPoint += myGoldenEstateCount * 12.5;
      antarcticEstatePoint += myAntarcticEstateCount * 6.25;
    } else {
      checkInPoint += 3.125;
      invitedUserPoint += (invitedUserCount + 1) * 0.625;

      virtualEstatePoint += myVirtualEstateCount * 9.375;
      goldenVEPoint += myGoldenEstateCount * 6.25;
      antarcticEstatePoint += myAntarcticEstateCount * 3.125;
    }

    // TODO(Hanggi): calculate the amount of point based on the formula of minging
    const res = await this.prisma.$transaction([
      this.prisma.pointRecords.create({
        data: {
          amount: checkInPoint,
          ownerID: userID,
          reason: "CHECK_IN",
        },
      }),
      this.prisma.pointRecords.create({
        data: {
          amount: invitedUserPoint,
          ownerID: userID,
          reason: "INVITATION_POINT",
        },
      }),
      this.prisma.pointRecords.create({
        data: {
          amount: virtualEstatePoint,
          ownerID: userID,
          reason: "VIRTUAL_ESTATE_POINT",
        },
      }),
      this.prisma.pointRecords.create({
        data: {
          amount: antarcticEstatePoint,
          ownerID: userID,
          reason: "ANTARCTICA_VIRTUAL_ESTATE_POINT",
        },
      }),
      this.prisma.pointRecords.create({
        data: {
          amount: antarcticEstatePoint,
          ownerID: userID,
          reason: "GOLDEN_VIRTUAL_ESTATE_POINT",
        },
      }),
    ]);

    return res;
  }

  // Checked in today
  async checkedInToday({ userID }: { userID: string }): Promise<boolean> {
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

    return !!checkIn;
  }

  async getPointInfo({ userID }: { userID: string }) {
    const haveCheckedInToday = await this.checkedInToday({ userID });

    return {
      checkedInToday: haveCheckedInToday,
    };
  }
}
