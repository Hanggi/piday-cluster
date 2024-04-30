import { IsEmail } from "class-validator";

export class ResetPasswordDto {
  newPassword: string;

  code: string;

  confirmPassword: string;

  email: string;
}
