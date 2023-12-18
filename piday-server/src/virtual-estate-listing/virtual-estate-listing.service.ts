import FlakeIdGen from "flake-idgen";

import { Injectable } from "@nestjs/common";

import { PrismaService } from "../lib/prisma/prisma.service";
import { CreateVirtualEstateListingDto } from "./dto/create-virtual-estate-listing.dto";

@Injectable()
export class VirtualEstateListingService {
  constructor(private prisma: PrismaService) {}
  async createVirtualEstateListing(createVirtualEstateListingDto: CreateVirtualEstateListingDto) {
    try {
      const { price, type, expiresAt, ownerID, virtualEstateID } =
        createVirtualEstateListingDto;
      const newVirtualEstate = await this.prisma.virtualEstateListing.create({
        data: {
          price,
          type,
          expiresAt,
          ownerID,
          virtualEstateID,
          listingID: this.createListingID(),
        },
      });

      if (!newVirtualEstate) {
        return null;
      }

      return {
        ...newVirtualEstate,
        listingID: newVirtualEstate.listingID.toString(),
      };
    } catch (error) {
      console.log("Error", error);
      return error;
    }
  }

  createListingID(): number {
    const generator = new FlakeIdGen();

    const idBuffer = generator.next();

    // 将 Buffer 转换为 BigInt，然后转换为十进制字符串
    const idDecimalString = BigInt("0x" + idBuffer.toString("hex")).toString();

    return parseInt(idDecimalString);
  }
}
