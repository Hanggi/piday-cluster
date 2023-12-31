"use client";

import { WrapperCard } from "@/src/components/WrapperCard";
import { useGetBalanceQuery } from "@/src/features/account/api/accountAPI";
import { cn } from "@/src/utils/cn";

import { Typography } from "@mui/joy";

import Image from "next/image";
import Link from "next/link";

import { ComponentProps } from "react";
import { useTranslation } from "react-i18next";

type StatisticsProps = ComponentProps<"div">;

export function MyPropertiesOverview({ className, ...props }: StatisticsProps) {
  const { t } = useTranslation("profile");

  const { data: balance } = useGetBalanceQuery({});

  return (
    <div className={cn(className)} {...props}>
      <Typography level="h4">
        {t("profile:leaderboard.overviewStatistics")}
      </Typography>
      <div className="grid grid-cols-1 gap-5 my-4 lg:grid-cols-2 xl:grid-cols-3">
        <Link href="/my/balance">
          <WrapperCard
            className="relative"
            key={"profile:leaderboard.totalWalletAssets"}
            style={{
              background: "linear-gradient(98deg, #FFB800 0%, #FF7A00 100%)",
            }}
          >
            <Typography className="!text-white">
              {t("profile:leaderboard.totalWalletAssets")}
            </Typography>
            <Typography className="!text-white" level="h2">
              {balance || 0}
            </Typography>
            <Image
              alt="icon"
              className="absolute right-0 bottom-0 opacity-40 grayscale invert"
              height={106}
              src={"/img/mining/database.svg"}
              width={106}
            />
          </WrapperCard>
        </Link>

        <Link href="/my/assets">
          <WrapperCard
            className="relative"
            key={"profile:leaderboard.landAssetQuantity"}
            style={{
              background: "linear-gradient(98deg, #B479E0 0%, #7030A0 100%)",
            }}
          >
            <Typography className="!text-white">
              {t("profile:leaderboard.landAssetQuantity")}
            </Typography>
            <Typography className="!text-white" level="h2">
              0
            </Typography>
            <Image
              alt="icon"
              className="absolute right-0 bottom-0 opacity-40 grayscale invert"
              height={106}
              src={"/img/mining/dashboard.svg"}
              width={106}
            />
          </WrapperCard>
        </Link>

        <WrapperCard
          className="relative"
          key={"profile:leaderboard.totalMiningPoints"}
          style={{
            background: "linear-gradient(98deg, #00C2FF 0%, #0085FF 100%)",
          }}
        >
          <Typography className="!text-white">
            {t("profile:leaderboard.totalMiningPoints")}
          </Typography>
          <Typography className="!text-white" level="h2">
            0
          </Typography>
          <Image
            alt="icon"
            className="absolute right-0 bottom-0 opacity-40 grayscale invert"
            height={106}
            src={"/img/mining/tools.svg"}
            width={106}
          />
        </WrapperCard>
      </div>
    </div>
  );
}

const statisticsData = [
  {
    translationKey: "profile:leaderboard.totalWalletAssets",
    value: 21547,
    icon: "/img/mining/database.svg",
    color: "linear-gradient(98deg, #FFB800 0%, #FF7A00 100%)",
  },
  {
    translationKey: "profile:leaderboard.landAssetQuantity",
    value: 24,
    icon: "/img/mining/dashboard.svg",
    color: "linear-gradient(98deg, #B479E0 0%, #7030A0 100%)",
  },
  {
    translationKey: "profile:leaderboard.totalMiningPoints",
    value: 0,
    icon: "/img/mining/tools.svg",
    color: "linear-gradient(98deg, #00C2FF 0%, #0085FF 100%)",
  },
];
