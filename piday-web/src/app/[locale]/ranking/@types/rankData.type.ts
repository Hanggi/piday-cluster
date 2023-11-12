export type RankDataKey =
  | "country"
  | "personal"
  | "invitation"
  | "commission"
  | "transaction";

export type CountryRankData = {
  nation: string;
  amountOfLand: number;
  numberOfHolders: number;
};
export type PersonalRankData = {
  username: string;
  numberOfLandHoldings: number;
  totalPoints: number;
};
export type InvitationRankData = {
  username: string;
  numberOfInvitedUserRegistrations: number;
  totalPoints: number;
};
export type CommissionRankData = {
  username: string;
  numberOfLandHoldings: number;
  totalPoints: number;
};
export type TransactionRankData = {
  nation: string;
  numberOfLandTransactions: number;
  numberOfLandTransactions2: number;
  turnover: number;
};

export type RankData =
  | CountryRankData
  | PersonalRankData
  | InvitationRankData
  | CommissionRankData
  | TransactionRankData;
