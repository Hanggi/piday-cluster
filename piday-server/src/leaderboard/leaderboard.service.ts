import { Injectable } from "@nestjs/common";

import { PrismaService } from "../lib/prisma/prisma.service";

@Injectable()
export class LeaderBoardService {
  constructor(private prisma: PrismaService) {}

  // Invitation Rank: Users who invited the most others
  async getInvitationRank() {
    return this.prisma.user.findMany({
      orderBy: {
        invited: {
          _count: "desc",
        },
      },
      select: {
        id: true,
        username: true,
        invited: {
          select: {
            id: true,
          },
        },
      },
    });
  }

  // Commission Rank: Users who earned the most commission from Virtual Estate transactions
  async getCommissionRank() {
    // Aggregate the sum of prices for each seller (user)
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
      });

    // Fetch user details along with their total commission
    const rankedUsers = await Promise.all(
      commissionRanks.map(async (rank) => {
        const user = await this.prisma.user.findUnique({
          where: { keycloakID: rank.sellerID },
          select: {
            id: true,
            username: true,
          },
        });
        return {
          ...user,
          totalCommission: rank._sum.price,
        };
      }),
    );

    return rankedUsers;
  }

  // Points Rank: Users who have the highest point balance
  async getPointsRank() {
    // Aggregate the sum of points for each user
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
    });

    // Fetch user details along with their total points
    const rankedUsers = await Promise.all(
      pointRanks.map(async (rank) => {
        const user = await this.prisma.user.findUnique({
          where: { keycloakID: rank.ownerID },
          select: {
            id: true,
            username: true,
          },
        });
        return {
          ...user,
          totalPoints: rank._sum.amount,
        };
      }),
    );

    return rankedUsers;
  }
}
