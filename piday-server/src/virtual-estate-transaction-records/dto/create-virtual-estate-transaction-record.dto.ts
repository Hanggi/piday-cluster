import { UserResponseDto } from "@/src/user/dto/user.dto";
import { Exclude, Expose, Type } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateVirtualEstateTransactionRecordDto {
  @IsNotEmpty()
  @IsString()
  virtualEstateID: string;

  @IsNotEmpty()
  @IsString()
  sellerID: string;

  @IsNotEmpty()
  @IsString()
  bidID: string;
}

export class AcceptAskRequestTransactionRecordDto {
  @IsNotEmpty()
  @IsString()
  virtualEstateID: string;

  @IsNotEmpty()
  @IsString()
  buyerID: string;

  @IsNotEmpty()
  @IsString()
  askID: string;
}

export class VirtualEstateTransactionRecordResponseDto {
  constructor(partial: Partial<VirtualEstateTransactionRecordResponseDto>) {
    Object.assign(this, partial);
  }
  @Exclude()
  id: number;

  @Expose()
  @Type(() => String)
  transactionID: string;

  @Expose()
  virtualEstateID: string;

  @Expose()
  sellerID: string;

  @Expose()
  @Type(() => UserResponseDto)
  buyer?: UserResponseDto;

  @Expose()
  @Type(() => String)
  price: number;

  @Expose()
  createdAt: Date;
}
