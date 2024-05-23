import { IsEmail, IsNotEmpty, MinLength, isEmail } from "class-validator";

export class ResetPaymentPasswordDto {
  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;

  @IsNotEmpty()
  @MinLength(6)
  confirmPassword: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  code: string;
}
