import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateWithdrawRequestDTO {
  @IsString()
  @IsNotEmpty()
  amount: string;
}
export class CancelWithdrawRequestDTO {
  @IsInt()
  @IsNotEmpty()
  withdrawStatusID: string;
}

export enum WithdrawStatusEnum {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  CANCELED = "CANCELED",
}
