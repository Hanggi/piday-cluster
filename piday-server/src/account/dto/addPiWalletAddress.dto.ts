import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdatePiWalletAddressDto {
  @IsString()
  @IsNotEmpty()
  piWalletAddress: string;
}
