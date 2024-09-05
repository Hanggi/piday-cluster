import { Injectable } from "@nestjs/common";

import { PrismaService } from "../lib/prisma/prisma.service";

@Injectable()
export class LeaderBoardService {
  constructor(private prisma: PrismaService) {}

  // Invitation Rank: Users who invited the most others
  async getInvitationRank(page: number, size: number) {
    const skip = (page - 1) * size;
    const take = size;

    const invitationRanks = await this.prisma.user.findMany({
      orderBy: {
        invited: {
          _count: "desc", // This counts the invited users
        },
      },
      skip,
      take: parseInt(take as unknown as string),
      include: {
        invited: true, // Include the invited users
        PointRecords: {
          select: {
            amount: true,
          },
        },
      },
    });

    const total = await this.prisma.user.count();

    return {
      total: total,
      rank: invitationRanks.map((user) => ({
        username: user.username,
        numberOfInvitedUserRegistrations: user.invited.length, // Count the number of invited users
        totalPoints: user.PointRecords.reduce(
          (sum, record) => sum + record.amount.toNumber(),
          0,
        ), // Sum the points
      })),
    };
  }

  // Commission Rank: Users who earned the most commission from Virtual Estate transactions
  async getCommissionRank(page: number, size: number) {
    const skip = (page - 1) * size;
    const take = size;

    // Group by sellerID and sum the price
    const commissionRanks =
      await this.prisma.virtualEstateTransactionRecords.groupBy({
        by: ["sellerID"],
        _sum: {
          price: true,
        },
        orderBy: {
          _sum: {
            price: "desc",
          },
        },
        skip: skip,
        take: parseInt(take as unknown as string),
      });

    // Count the total distinct sellerIDs
    const totalCount =
      await this.prisma.virtualEstateTransactionRecords.groupBy({
        by: ["sellerID"],
        _count: {
          _all: true,
        },
      });

    const rankedUsers = await Promise.all(
      commissionRanks.map(async (rank) => {
        const user = await this.prisma.user.findUnique({
          where: { keycloakID: rank.sellerID },
          include: {
            virtualEstates: true,
          },
        });
        return {
          username: user?.username ?? "Unknown",
          numberOfLandHoldings: user?.virtualEstates.length ?? 0,
          totalCommission: rank._sum.price,
        };
      }),
    );

    return {
      ranks: rankedUsers,
      total: totalCount.length,
    };
  }

  // Points Rank: Users who have the highest point balance
  async getPointsRank(page: number, size: number) {
    const skip = (page - 1) * size;
    const take = size;

    const pointRanks = await this.prisma.pointRecords.groupBy({
      by: ["ownerID"],
      _sum: {
        amount: true,
      },
      orderBy: {
        _sum: {
          amount: "desc",
        },
      },
      skip,
      take: parseInt(take as unknown as string),
    });

    const rankedUsers = await Promise.all(
      pointRanks.map(async (rank) => {
        const user = await this.prisma.user.findUnique({
          where: { keycloakID: rank.ownerID },
          include: {
            virtualEstates: true, // Include land holdings
          },
        });

        return {
          username: user?.username ?? "Unknown",
          numberOfLandHoldings: user?.virtualEstates.length ?? 0, // Count land holdings
          totalPoints: rank._sum.amount ?? 0,
        };
      }),
    );

    return rankedUsers;
  }
}
