import { Decimal } from "@prisma/client/runtime/library";

export interface VirtualEstatesStatistics {
  totalVirtualEstatesMinted?: number;
  virtualEstateListingCount?: number;
  totalTransactionVolume?: Decimal;
  transactionRecordsCount?: number;
}
