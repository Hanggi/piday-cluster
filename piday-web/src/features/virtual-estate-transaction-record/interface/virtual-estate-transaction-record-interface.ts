import { User } from "../../auth/interface/User.interface";

export interface VirtualEstateTransactionRecordInterface {
  id?: number;

  virtualEstateID: string;
  transactionID: string;

  buyerID: string;
  buyer: User;

  sellerID: string;
  seller: User;

  price: string;

  createdAt: string;
}
