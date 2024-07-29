import { User } from "../../auth/interface/User.interface";

export interface WithdrawRequest {
  id?: number;
  withdrawStatusID: string;

  ownerID: string;
  owner: User;

  amount: string;
  status: string;

  createdAt: string;
  updatedAt: string;
}
