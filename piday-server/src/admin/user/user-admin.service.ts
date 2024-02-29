import { getUserVisibleID } from "@/src/lib/generate-id/generate-user-id";
import { PrismaService } from "@/src/lib/prisma/prisma.service";

import { Injectable } from "@nestjs/common";

import { OrderByOptions, SortByOptions } from "../dto/admin.dto";

@Injectable()
export class UserAdminService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers(
    page: number,
    size: number,
    sort?: SortByOptions,
    order?: OrderByOptions,
    email?: string,
    username?: string,
    piAddress?: string,
    withBalance?: boolean,
  ) {
    const query = {};

    if (email) query["email"] = { contains: `%${email}%` };
    if (username) query["username"] = { contains: `%${username}%` };
    if (piAddress) query["piAddress"] = { contains: `%${piAddress}%` };

    const orderObj = {};
    if (sort && order) {
      orderObj[sort] = order;
    }

    console.log(withBalance);
    let users = await this.prisma.user.findMany({
      where: query,
      take: +size,
      skip: +((page === 0 ? 1 : page - 1) * size),
      orderBy: orderObj,
    });

    users.forEach((user) => {
      const visibleID = getUserVisibleID(user.id);
      (user as any).vid = visibleID;
    });
    console.log(users);

    if (withBalance) {
      const usersWithRechargeSums = await Promise.all(
        users.map(async (user) => {
          const rechargeSum = await this.prisma.rechargeRecords.aggregate({
            _sum: {
              amount: true,
            },
            where: {
              ownerID: user.keycloakID,
            },
          });

          return {
            ...user,
            balance: rechargeSum._sum.amount,
          };
        }),
      );

      users = usersWithRechargeSums;
    }

    const totalCount = await this.prisma.user.count({
      where: query,
    });

    return { user: users, totalCount: totalCount };
  }
}
