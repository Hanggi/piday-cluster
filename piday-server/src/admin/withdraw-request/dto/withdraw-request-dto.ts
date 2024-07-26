import { Expose, Transform } from "class-transformer";

export class WithdrawRequestDto {
  @Expose()
  id: number;

  @Expose()
  @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  withdrawStatusID: string;

  @Expose()
  ownerID: string;

  @Expose()
  status: string;

  @Expose()
  amount: number;

  @Expose()
  piTransactionID: string | null;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  owner: object;
}
