import { IsNotEmpty, IsString } from "class-validator";

export class CreateWithdrawRequestDTO {
  @IsString()
  @IsNotEmpty()
  amount: string;

  @IsString()
  @IsNotEmpty()
  paymentPassword: string;
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
