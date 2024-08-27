import { User } from "../../auth/interface/User.interface";
import { VirtualEstateListing } from "../../virtual-estate-listing/interface/virtual-estate-listing.interface";
import { VirtualEstateTransactionRecord } from "../../virtual-estate-transaction-record/interface/virtual-estate-transaction-record-interface";

export type VirtualEstateLevel =
  | "GENESIS"
  | "GOLD"
  | "SLIVER"
  | "BRONZE"
  | "NORMAL"
  | "UNKNOWN";

export interface VirtualEstate {
  id?: number;

  name: string;
  virtualEstateID: string;
  isGenesis: boolean;
  level: VirtualEstateLevel;

  lastPrice: string;

  owner: User;

  createdAt: Date;
  updatedAt: Date;

  listings?: VirtualEstateListing[];
  transactions?: VirtualEstateTransactionRecord[];
}
