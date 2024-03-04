import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateWithdrawRequestDTO {
  @IsString()
  @IsNotEmpty()
  amount: string;
}
export class CancelWithdrawRequestDTO {
  @IsInt()
  @IsNotEmpty()
  reqID: number;
}

export enum WithdrawStatusEnum {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  CANCELED = "CANCELED",
}
