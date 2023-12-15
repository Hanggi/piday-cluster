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

  async getAllVirtualEstatesForSignedUser(
    userId: string,
  ): Promise<VirtualEstate[]> {
    console.log("Got The Request in the service", userId);
    const virtualEstates = await this.prisma.virtualEstate.findMany({
      where: {
        ownerID: userId,
      },
      include: {
        owner: true,
      },
    });
    console.log(virtualEstates);
    return virtualEstates;
  }
}
