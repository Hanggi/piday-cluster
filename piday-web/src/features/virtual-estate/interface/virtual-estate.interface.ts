import { User } from "../../auth/interface/User.interface";
import { VirtualEstateListing } from "../../virtual-estate-listing/interface/virtual-estate-listing.interface";

export interface VirtualEstate {
  id?: number;

  name: string;
  virtualEstateID: string;
  isGenesis: boolean;

  lastPrice: string;

  owner: User;

  createdAt: Date;
  updatedAt: Date;

  listings?: VirtualEstateListing[];
}
