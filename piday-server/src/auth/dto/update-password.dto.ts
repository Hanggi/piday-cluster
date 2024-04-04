import { IsEmail } from "class-validator";

export class UpdatePasswordDto {
  newPassword: string;

  oldPassword: string;

  confirmPassword: string;
}
