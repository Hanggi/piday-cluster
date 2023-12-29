import { TransactionType } from "@prisma/client";
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
  expiresAt: Date = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000); // current time + 15 days
}
