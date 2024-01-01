import { Injectable } from "@nestjs/common";

import { generateFlakeID } from "../lib/generate-id/generate-flake-id";
import { PrismaService } from "../lib/prisma/prisma.service";
import { CreateVirtualEstateListingDto } from "./dto/create-virtual-estate-listing.dto";

@Injectable()
export class VirtualEstateListingService {
  constructor(private prisma: PrismaService) {}
  async createVirtualEstateListing({
    price,
    type,
    expiresAt,
    ownerID,
    virtualEstateID,
  }: CreateVirtualEstateListingDto) {
    // Check if there are any existing listings made by the same owner
    const query = {
      virtualEstateID,
      ownerID,
      expiresAt: {
        gt: new Date(),
      },
    };
    const existing = await this.prisma.virtualEstateListing.findMany({
      where: query,
    });

    if (existing.length > 0) {
      await this.prisma.virtualEstateListing.updateMany({
        where: query,
        data: {
          expiresAt: new Date(),
        },
      });
    }

    try {
      const listingID = BigInt(generateFlakeID());
      const newVirtualEstate = await this.prisma.virtualEstateListing.create({
        data: {
          price,
          type,
          expiresAt,
          ownerID,
          virtualEstateID,
          listingID: listingID,
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
          expiresAt: {
            gt: new Date(),
          },
        },
        include: {
          owner: true,
        },
      });

    return virtualEstateListingOffersAndBids;
  }

  async getOneListingDetail(bidID: bigint) {
    const virtualEstateListingOffersAndBids =
      await this.prisma.virtualEstateListing.findFirst({
        where: {
          listingID: bidID,
          // Bid should not be expired
          expiresAt: {
            gt: new Date(),
          },
        },
      });
    return virtualEstateListingOffersAndBids;
  }

  async getVirtualEstateListingsCount(endDate: Date, startDate: Date) {
    try {
      const virtualEstateListingCount = await this.prisma.virtualEstateListing.count({
        where: {
          createdAt: { gte: startDate, lte: endDate },
        },
      });

      return virtualEstateListingCount
    } catch (error) {
      throw error;
    }
  }
}
