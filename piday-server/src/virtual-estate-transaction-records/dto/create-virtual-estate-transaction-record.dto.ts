import { IsNotEmpty, IsString } from "class-validator";

export class CreateVirtualEstateTransactionRecordDto {
  @IsNotEmpty()
  @IsString()
  virtualEstateID: string;

  @IsString()
  @IsNotEmpty()
  price: string;

  @IsNotEmpty()
  @IsString()
  buyerID: string;

  @IsNotEmpty()
  @IsString()
  sellerID: string;
}
