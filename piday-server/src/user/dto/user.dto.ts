export class UserResponseDto {
  id?: string; // keycloak UUID

  username: string;
  avatar?: string;

  createdAt: Date;
  updatedAt: Date;
}
