import { VirtualEstate } from "@prisma/client";
import { kRing } from "h3-js";

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

  async getAllVirtualEstatesForSignedUser(
    userId: string,
    size: number,
    page: number,
  ): Promise<VirtualEstate[]> {
    console.log("Got The Request in the service", userId);
    const virtualEstates = await this.prisma.virtualEstate.findMany({
      where: {
        ownerID: userId,
      },
      include: {
        owner: true,
      },
      take: size,
      skip: (page - 1) * size,
    });
    console.log(virtualEstates);
    return virtualEstates;
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

  async getHexIDsStatusInArea({
    hexID,
  }: {
    hexID: string;
  }): Promise<{ onSale: string[]; sold?: string[] }> {
    const hexIDsInArea = kRing(hexID, 15).map((hex) => {
      return hex;
    });
    const virtualEstatesHasOwner = await this.prisma.virtualEstate.findMany({
      select: {
        virtualEstateID: true, // 只选择 id 字段
      },
      where: {
        virtualEstateID: {
          in: hexIDsInArea,
        },
      },
    });

    console.log(virtualEstatesHasOwner);

    return {
      onSale: [],
      sold: virtualEstatesHasOwner.map((ve) => ve.virtualEstateID) || [],
    };
  }
}
