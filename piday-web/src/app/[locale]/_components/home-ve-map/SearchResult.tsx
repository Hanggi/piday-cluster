"use client";

import { WrapperCard } from "@/src/components/WrapperCard";
import PiCoinLogo from "@/src/components/piday-ui/PiCoinLogo";
import { Statistics } from "@/src/features/virtual-estate/interface/statistics.interface";

import { Typography } from "@mui/joy";

import { useTranslation } from "react-i18next";

interface Props {
  statistics: Statistics;
}

export function SearchResult({ statistics }: Props) {
  const { t } = useTranslation(["home"]);

  return (
    <div className="mt-8 ">
      {/* <Typography className="text-center py-10" level="h4">
        {t("userCount")}（189898） {t("landOwnersCount")}（39824）{" "}
        {t("onlineUsersCount")}（12289）
      </Typography> */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 container-mini gap-4">
        <WrapperCard className="flex flex-col items-center">
          <Typography className="font-semibold !text-secondary" level="h4">
            {statistics.totalVirtualEstatesMinted}
            <span className="text-xs"></span>
          </Typography>
          <Typography className="!text-sm text-center pt-1.5 pb-4">
            {t("home:statistics.totalVirtualEstatesMinted")}
          </Typography>
        </WrapperCard>

        <WrapperCard className="flex flex-col items-center">
          <Typography className="font-semibold !text-secondary" level="h4">
            {statistics.virtualEstateListingCount}
            <span className="text-xs"></span>
          </Typography>
          <Typography className="!text-sm text-center pt-1.5 pb-4">
            {t("home:statistics.virtualEstateListingCount")}
          </Typography>
        </WrapperCard>

        <WrapperCard className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            <div className="relative w-4 h-4">
              <PiCoinLogo />
            </div>
            <Typography className="font-semibold !text-secondary" level="h4">
              {statistics.totalTransactionVolume}
            </Typography>
          </div>
          <Typography className="!text-sm text-center pt-1.5 pb-4">
            {t("home:statistics.totalTransactionVolume")}
          </Typography>
        </WrapperCard>

        <WrapperCard className="flex flex-col items-center">
          <Typography className="font-semibold !text-secondary" level="h4">
            {statistics.transactionRecordsCount}
            <span className="text-xs"></span>
          </Typography>
          <Typography className="!text-sm text-center pt-1.5 pb-4">
            {t("home:statistics.transactionRecordsCount")}
          </Typography>
        </WrapperCard>
      </section>
    </div>
  );
}
