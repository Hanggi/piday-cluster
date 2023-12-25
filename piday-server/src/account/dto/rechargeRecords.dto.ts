import { Decimal } from "@prisma/client/runtime/library";
import { Exclude, Expose, Type } from "class-transformer";

export class RechargeRecordResponseDto {
  @Exclude()
  id: number;

  @Expose()
  amount: Decimal;

  @Expose()
  @Type(() => String)
  reason: string;

  @Expose()
  externalID: string;

  @Expose()
  createdAt: Date;
}
