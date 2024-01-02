import { User } from "../../auth/interface/User.interface";

export interface VirtualEstate {
  id?: number;
  virtualEstateID: string;

  lastPrice: string;

  owner: User;

  createdAt: Date;
  updatedAt: Date;
}
