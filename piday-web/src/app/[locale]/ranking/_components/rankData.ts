const country = [
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
] as const;
const personal = [
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
] as const;
const invitation = [
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
] as const;
const commission = [
  {
    username: "张**",
    numberOfLandHoldings: 2400,
    totalPoints: 2344,
  },
] as const;
const transaction = [
  {
    nation: "中国",
    numberOfLandTransactions: 2400,
    numberOfLandTransactions2: 1000,
    turnover: 2000,
  },
] as const;

export const rankData = {
  country,
  personal,
  invitation,
  commission,
  transaction,
};

export type RankDataKey = keyof typeof rankData;
