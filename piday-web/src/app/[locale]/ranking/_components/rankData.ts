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

export const rankData = { country, personal };

export type RankDataKey = keyof typeof rankData;
