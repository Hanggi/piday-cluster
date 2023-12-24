import { IsNotEmpty, IsString, isString } from "class-validator";

export class CreateVirtualEstateTransactionRecordDto {
  @IsNotEmpty()
  @IsString()
  virtualEstateID: string;

  @IsNotEmpty()
  @IsString()
  sellerID: string;

  @IsNotEmpty()
  @IsString()
  bidID: string
}
