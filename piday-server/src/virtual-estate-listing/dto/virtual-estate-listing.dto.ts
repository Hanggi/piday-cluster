import { UserResponseDto } from "@/src/user/dto/user.dto";
import { TransactionType } from "@prisma/client";
import { Exclude, Expose, Type } from "class-transformer";

export class VirtualEstateListingResponseDto {
  @Exclude()
  id: number;

  @Expose()
  @Type(() => String)
  listingID: string;

  @Expose()
  virtualEstateID: string;

  @Expose()
  @Type(() => String)
  price: string;

  @Expose()
  type: TransactionType;

  @Expose()
  @Type(() => UserResponseDto)
  owner: UserResponseDto;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  expiresAt?: Date;
}
