import { User } from "../../auth/interface/User.interface";

export interface VirtualEstateListing {
  id: number;
  virtualEstateID: string;
  listingID: string;
  price: string;
  type: TransactionType;

  owner: User;

  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}

export enum TransactionType {
  BID = "BID",
  ASK = "ASK",
}
