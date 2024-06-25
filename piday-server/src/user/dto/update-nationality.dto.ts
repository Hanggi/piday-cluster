import { IsNotEmpty, IsString } from "class-validator";

export class UpdateNationalityDto {
  @IsString()
  @IsNotEmpty()
  nationality: string;
}
