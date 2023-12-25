import { Expose } from "class-transformer";

export class UserResponseDto {
  @Expose({ name: "keycloakID" })
  id: string;

  @Expose()
  username: string;
  @Expose()
  avatar?: string;

  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;
}
