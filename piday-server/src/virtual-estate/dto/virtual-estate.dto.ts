import { UserResponseDto } from "@/src/user/dto/user.dto";
import { Exclude, Expose, Type } from "class-transformer";

export class VirtualEstateResponseDto {
  constructor(partial: Partial<VirtualEstateResponseDto>) {
    Object.assign(this, partial);
  }

  @Exclude()
  id: number;

  @Expose()
  virtualEstateID: string;

  @Expose()
  @Type(() => String)
  lastPrice: string;
  @Expose()
  address?: string;

  @Expose()
  @Type(() => UserResponseDto)
  owner: UserResponseDto;

  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;
}
