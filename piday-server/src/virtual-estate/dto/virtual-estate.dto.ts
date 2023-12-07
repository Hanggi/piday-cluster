import { UserResponseDto } from "@/src/user/dto/user.dto";

export class VirtualEstateResponseDto {
  virtualEstateID: string;

  lastPrice: string;
  address?: string;

  owner: UserResponseDto;

  createdAt: Date;
  updatedAt: Date;
}
