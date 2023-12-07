import { User } from "../../auth/interface/User.interface";

export interface VirtualEstate {
  id: number;
  lastPrice: string;

  owner: User;

  createdAt: Date;
  updatedAt: Date;
}
