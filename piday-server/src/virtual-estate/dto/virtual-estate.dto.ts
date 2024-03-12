import { UserResponseDto } from "@/src/user/dto/user.dto";
import { VirtualEstateListingResponseDto } from "@/src/virtual-estate-listing/dto/virtual-estate-listing.dto";
import { Exclude, Expose, Type } from "class-transformer";

export class VirtualEstateResponseDto {
  constructor(partial: Partial<VirtualEstateResponseDto>) {
    Object.assign(this, partial);
  }

  @Exclude()
  id: number;

  @Expose()
  name: string;

  @Expose()
  virtualEstateID: string;

  @Expose()
  @Type(() => String)
  lastPrice: string;

  @Expose()
  address?: string;

  @Expose()
  @Type(() => UserResponseDto)
  owner: UserResponseDto;

  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;

  // Additional fields
  @Expose()
  @Type(() => VirtualEstateListingResponseDto)
  listings?: VirtualEstateListingResponseDto[];
}
