import { IsEmail } from "class-validator";

export class UpdatePasswordDto {
  newPassword: string;

  code: string;

  confirmPassword: string;

  email: string;
}
