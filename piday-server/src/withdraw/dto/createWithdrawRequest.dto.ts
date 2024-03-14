import { IsNotEmpty, IsString } from "class-validator";

export class CreateWithdrawRequestDTO {
  @IsString()
  @IsNotEmpty()
  amount: string;
}
export class CancelWithdrawRequestDTO {
  @IsString()
  @IsNotEmpty()
  withdrawStatusID: string;
}

export enum WithdrawStatusEnum {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  CANCELED = "CANCELED",
}
