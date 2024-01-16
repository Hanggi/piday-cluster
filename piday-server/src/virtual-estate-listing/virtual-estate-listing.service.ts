import { TransactionType, VirtualEstateListing } from "@prisma/client";

import { Injectable } from "@nestjs/common";

import { ServiceException } from "../lib/exceptions/service-exception";
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
    switch (type) {
      case TransactionType.BID:
        if (existing.length > 0) {
          await this.prisma.virtualEstateListing.updateMany({
            where: query,
            data: {
              expiresAt: new Date(),
            },
          });
        }
        break;

      case TransactionType.ASK:
        // check if user is owner of the virtual estate
        const virtualEstate = await this.prisma.virtualEstate.findFirst({
          where: {
            virtualEstateID: virtualEstateID,
          },
        });
        if (virtualEstate.ownerID !== ownerID)
          throw new ServiceException(
            "You are not the owner of the virtual estate",
            "NOT_OWNER",
          );
        //expires previous listings
        if (existing.length > 0) {
          await this.prisma.virtualEstateListing.updateMany({
            where: query,
            data: {
              expiresAt: new Date(),
            },
          });
        }
        break;
    }

    try {
      const listingID = BigInt(generateFlakeID());
      const newVirtualEstateListing =
        await this.prisma.virtualEstateListing.create({
          data: {
            price,
            type,
            expiresAt,
            ownerID,
            virtualEstateID,
            listingID: listingID,
          },
        });

      if (!newVirtualEstateListing) {
        return null;
      }

      return {
        ...newVirtualEstateListing,
        listingID: newVirtualEstateListing.listingID.toString(),
      };
    } catch (error) {
      return error;
    }
  }

  async getVirtualEstateOffersAndBidding(
    hexID: string,
  ): Promise<VirtualEstateListing[]> {
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

  async getOneListingDetail(bidID: bigint): Promise<VirtualEstateListing> {
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

  async getVirtualEstateListingsCount(
    endDate: Date,
    startDate: Date,
  ): Promise<number> {
    try {
      const virtualEstateListingCount =
        await this.prisma.virtualEstateListing.count({
          where: {
            createdAt: { gte: startDate, lte: endDate },
          },
        });

      return virtualEstateListingCount;
    } catch (error) {
      throw error;
    }
  }
}
