import { IsEmail } from "class-validator";

export class EmailQueryDto {
  @IsEmail()
  email: string;
}

export class EmailSignupDto extends EmailQueryDto {
  code: string;
  inviteCode: string;
  password: string;
}
