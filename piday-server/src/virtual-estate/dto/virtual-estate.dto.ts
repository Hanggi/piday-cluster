import { UserResponseDto } from "@/src/user/dto/user.dto";
import { VirtualEstateListingResponseDto } from "@/src/virtual-estate-listing/dto/virtual-estate-listing.dto";
import { VirtualEstateTransactionRecordResponseDto } from "@/src/virtual-estate-transaction-records/dto/create-virtual-estate-transaction-record.dto";
import { Exclude, Expose, Transform, Type } from "class-transformer";

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

  @Expose()
  @Type(() => VirtualEstateTransactionRecordResponseDto)
  transactions?: VirtualEstateTransactionRecordResponseDto;

  // Custom fields

  // New field: level
  @Expose()
  // @Transform(({ obj }) => {
  //   if (obj.id < 30_000) {
  //     return "GENESIS";
  //   } else if (obj.id >= 30_000 && obj.id < 300_000) {
  //     return "GOLD";
  //   } else if (obj.id >= 300_000 && obj.id < 1_000_000) {
  //     return "SILVER";
  //   } else if (obj.id >= 1_000_000 && obj.id < 10_000_000) {
  //     return "BRONZE";
  //   } else {
  //     return "NORMAL";
  //   }
  // })
  level: string;
}
