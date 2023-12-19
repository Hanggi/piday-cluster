import { TransactionType } from "@prisma/client";
import { Exclude, Expose, Type } from "class-transformer";

export class VirtualEstateListingDto {
  @Exclude()
  id: number;

  @Expose()
  virtualEstateID: string;

  @Expose()
  @Type(() => String)
  price: string;

  @Expose()
  type: TransactionType;

  @Expose()
  ownerID: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  expiresAt?: Date;
}
