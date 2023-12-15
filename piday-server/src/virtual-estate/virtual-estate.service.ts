import { VirtualEstate } from "@prisma/client";

import { Injectable } from "@nestjs/common";

import { PrismaService } from "../lib/prisma/prisma.service";

@Injectable()
export class VirtualEstateService {
  constructor(private prisma: PrismaService) {}

  async getOneVirtualEstate(hexID: string): Promise<VirtualEstate> {
    const virtualEstate = await this.prisma.virtualEstate.findFirst({
      where: {
        virtualEstateID: hexID,
      },
      include: {
        owner: true,
      },
    });

    console.log(virtualEstate);

    return virtualEstate;
  }

  async mintVirtualEstate({
    userID,
    hexID,
  }: {
    userID: string;
    hexID: string;
  }): Promise<VirtualEstate> {
    // TODO(Hanggi): Check if the user has enough balance to mint a virtual estate

    const virtualEstate = await this.prisma.virtualEstate.create({
      data: {
        // VirtualEstateID is a unique identifier for a virtual estate,
        // it's generated by H3HexagonLayer with the resolution of 12
        virtualEstateID: hexID,

        lastPrice: 10,

        ownerID: userID,
      },
    });

    // TODO(Hanggi): Update the user's balance by leaving a recharge record

    return virtualEstate;
  }
}
