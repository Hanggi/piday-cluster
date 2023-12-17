import { TransactionType } from "@/src/utils/types";

import { User } from "../../auth/interface/User.interface";

export interface VirtualEstateListing {
  id: number;
  virtualEstateID: string;
  listingID: string;
  price: string;
  type: TransactionType;
  createdAt: Date;
  updatedAt: Date;
}
