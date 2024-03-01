import { User } from "../../auth/interface/User.interface";

export interface VirtualEstate {
  id?: number;

  name: string;
  virtualEstateID: string;

  lastPrice: string;

  owner: User;

  createdAt: Date;
  updatedAt: Date;
}
