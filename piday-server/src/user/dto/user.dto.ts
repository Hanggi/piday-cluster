import { Exclude, Expose } from "class-transformer";

export class UserResponseDto {
  @Exclude()
  id?: string; // keycloak UUID

  @Expose()
  username: string;
  @Expose()
  avatar?: string;

  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;
}
