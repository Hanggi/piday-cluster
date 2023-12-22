import { Injectable } from "@nestjs/common";

import { PrismaService } from "../lib/prisma/prisma.service";
import { createFlakeGenID } from "../lib/utils/create-flake-gen-id";
import { CreateVirtualEstateListingDto } from "./dto/create-virtual-estate-listing.dto";

@Injectable()
export class VirtualEstateListingService {
  constructor(private prisma: PrismaService) {}
  async createVirtualEstateListing(
    createVirtualEstateListingDto: CreateVirtualEstateListingDto,
  ) {
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
          listingID: createFlakeGenID(),
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

  async getVirtualEstateOffersAndBidding(hexID: string) {
    const virtualEstateListingOffersAndBids =
      await this.prisma.virtualEstateListing.findMany({
        where: {
          virtualEstateID: hexID,
        },
      });
    return virtualEstateListingOffersAndBids;
  }

  async getSingleListingDetail(bidId: string) {
    const virtualEstateListingOffersAndBids =
      await this.prisma.virtualEstateListing.findFirst({
        where: {
          listingID: parseInt(bidId),
        },
      });
    return virtualEstateListingOffersAndBids;
  }
}
