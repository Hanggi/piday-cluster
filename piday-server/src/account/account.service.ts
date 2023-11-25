import { Injectable } from "@nestjs/common";

import { PrismaService } from "../lib/prisma/prisma.service";

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}

  async getMyBalance() {
    const totalBalance = await this.prisma.rechargeRecords.aggregate({
      _sum: {
        amount: true,
      },
    });

    return totalBalance;
  }
}
