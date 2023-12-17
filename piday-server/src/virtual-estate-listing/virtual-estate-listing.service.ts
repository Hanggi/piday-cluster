import { Injectable } from "@nestjs/common";

import { PrismaService } from "../lib/prisma/prisma.service";
import { CreateVirtualEstateListingDto } from "./dto/create-virtual-estate-listing.dto";

@Injectable()
export class VirtualEstateListingService {
  constructor(private prisma: PrismaService) {}
  async create(createVirtualEstateListingDto: CreateVirtualEstateListingDto) {
    try {
      const newVirtualEstate = await this.prisma.virtualEstateListing.create({
        data: {
          ...createVirtualEstateListingDto,
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

  findAll() {
    return `This action returns all virtualEstateListing`;
  }

  findOne(id: number) {
    return `This action returns a #${id} virtualEstateListing`;
  }

  remove(id: number) {
    return `This action removes a #${id} virtualEstateListing`;
  }
}
