import { IsEmail } from "class-validator";

export class EmailQueryDto {
  userID?: string;

  @IsEmail()
  email: string;
}

export class EmailSignupDto extends EmailQueryDto {
  code: string;
  inviteCode: string;
  password: string;
}
