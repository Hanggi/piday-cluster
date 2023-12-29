import { TransactionType } from "@prisma/client";
import { Transform } from "class-transformer";
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateVirtualEstateListingDto {
  @IsOptional()
  virtualEstateID: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsOptional()
  ownerID: string;

  @IsString()
  @IsNotEmpty()
  type: TransactionType;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => {
    console.log(value);
    return new Date(value) || new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);
  })
  expiresAt: Date; // current time + 30 days
}
