import { User } from "../../auth/interface/User.interface";

export interface VirtualEstateTransactionRecordInterface {
  virtualEstateID: string;
  transactionID: string;

  buyerID: string;
  buyer: User;

  sellerID: string;

  price: string;

  createdAt: string;
}
