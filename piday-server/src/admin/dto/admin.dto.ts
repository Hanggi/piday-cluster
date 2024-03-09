import { CancelWithdrawRequestDTO } from "@/src/withdraw/dto/createWithdrawRequest.dto";
import { IsNotEmpty, IsString } from "class-validator";

export enum SortByOptions {
  CREATED_AT = "createdAt",
  UPDATED_AT = "updatedAt",
  EMAIL = "email",
  USERNAME = "username",
  PI_ADDRESS = "piAddress",
}

export enum OrderByOptions {
  ASC = "asc",
  DESC = "desc",
}

export type AcceptWithdrawRequestBody = Pick<
  CancelWithdrawRequestDTO,
  "withdrawStatusID"
>;

export class AddPiIDRequestBody extends CancelWithdrawRequestDTO {
  @IsString()
  @IsNotEmpty()
  piTransactionID: string;
}
