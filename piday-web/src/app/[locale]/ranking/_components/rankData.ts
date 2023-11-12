import { RankData } from "../@types/rankData.type";

const country: RankData[] = [
  {
    nation: "中国",
    amountOfLand: 2400,
    numberOfHolders: 1000,
  },
  {
    nation: "中国",
    amountOfLand: 2400,
    numberOfHolders: 1000,
  },
  {
    nation: "中国",
    amountOfLand: 2400,
    numberOfHolders: 1000,
  },
  {
    nation: "中国",
    amountOfLand: 2400,
    numberOfHolders: 1000,
  },
  {
    nation: "中国",
    amountOfLand: 2400,
    numberOfHolders: 1000,
  },
];
const personal: RankData[] = [
  {
    username: "张**",
    numberOfLandHoldings: 2400,
    totalPoints: 2344,
  },
  {
    username: "张**",
    numberOfLandHoldings: 2400,
    totalPoints: 2344,
  },
  {
    username: "张**",
    numberOfLandHoldings: 2400,
    totalPoints: 2344,
  },
];
const invitation: RankData[] = [
  {
    username: "张**",
    numberOfInvitedUserRegistrations: 2400,
    totalPoints: 2344,
  },
  {
    username: "张**",
    numberOfInvitedUserRegistrations: 2400,
    totalPoints: 2344,
  },
];
const commission: RankData[] = [
  {
    username: "张**",
    numberOfLandHoldings: 2400,
    totalPoints: 2344,
  },
];
const transaction: RankData[] = [
  {
    nation: "中国",
    numberOfLandTransactions: 2400,
    numberOfLandTransactions2: 1000,
    turnover: 2000,
  },
];

export const rankData = {
  country,
  personal,
  invitation,
  commission,
  transaction,
};
