import { Decimal } from "@prisma/client/runtime/library";
import { Exclude, Expose, Type } from "class-transformer";

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
