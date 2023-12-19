import { TransactionType } from "@prisma/client";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

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
  expiresAt?: Date;
}
