import { IsEmail } from "class-validator";

export class EmailQueryDto {
  @IsEmail()
  email: string;
}

export class EmailSignupDto extends EmailQueryDto {
  code: string;

  password: string;
}
