"use client";

import { WrapperCard } from "@/src/components/WrapperCard";
import { cn } from "@/src/utils/cn";

import { Typography } from "@mui/joy";

import Image from "next/image";

import { ComponentProps } from "react";
import { useTranslation } from "react-i18next";

type StatisticsProps = ComponentProps<"div">;

export function Statistics({ className, ...props }: StatisticsProps) {
  const { t } = useTranslation("profile");
  return (
    <div className={cn(className)} {...props}>
      <Typography level="h4">
        {t("profile:leaderboard.overviewStatistics")}
      </Typography>
      <div className="grid grid-cols-1 gap-5 my-4 lg:grid-cols-2 xl:grid-cols-3">
        {statisticsData.map((data) => (
          <WrapperCard
            className="relative"
            key={data.translationKey}
            style={{ background: data.color }}
          >
            <Typography className="!text-white">
              {t(data.translationKey)}
            </Typography>
            <Typography className="!text-white" level="h2">
              {data.value}
            </Typography>
            <Image
              alt="icon"
              className="absolute right-0 bottom-0 opacity-40 grayscale invert"
              height={106}
              src={data.icon}
              width={106}
            />
          </WrapperCard>
        ))}
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
    value: 15657,
    icon: "/img/mining/tools.svg",
    color: "linear-gradient(98deg, #00C2FF 0%, #0085FF 100%)",
  },
];
