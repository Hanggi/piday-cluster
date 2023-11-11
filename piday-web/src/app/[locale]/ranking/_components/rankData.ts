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

export const rankData = { country, personal };

export type RankDataKey = keyof typeof rankData;
