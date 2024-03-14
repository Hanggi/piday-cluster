import { Decimal } from "@prisma/client/runtime/library";
import { Exclude, Expose, Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class RechargeRecordResponseDto {
  @Exclude()
  id: number;

  @Expose()
  @Type(() => String)
  amount: Decimal;

  @Expose()
  reason: string;

  @Expose()
  externalID: string;

  @Expose()
  createdAt: Date;
}

export class TransferAmountBody {
  @IsNumber()
  amount: string;

  @IsString()
  @IsNotEmpty()
  piWalletAddress: string;

  paymentPassword?: string;
}
