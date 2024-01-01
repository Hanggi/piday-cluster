"use client";

import { WrapperCard } from "@/src/components/WrapperCard";
import { cn } from "@/src/utils/cn";

import { Button, Typography } from "@mui/joy";

import { ComponentProps } from "react";
import { useTranslation } from "react-i18next";

type SearchResultProps = ComponentProps<"div">;

export function SearchResult({ className, ...props }: SearchResultProps) {
  const { t } = useTranslation("home");

  

  return (
    <div className={cn("", className)} {...props}>
      {/* <Typography className="text-center py-10" level="h4">
        {t("userCount")}（189898） {t("landOwnersCount")}（39824）{" "}
        {t("onlineUsersCount")}（12289）
      </Typography> */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 container-mini gap-6">
        {searchData.map((data, i) => (
          <WrapperCard className="flex flex-col items-center" key={i}>
            <Typography className="font-semibold !text-secondary" level="h4">
              {data.value}
              <span className="text-xs">个</span>
            </Typography>
            <Typography className="!text-sm text-center pt-1.5 pb-4">
              {t(data.translationKey)}
            </Typography>
            <Button
              className="!rounded-full inline-flex gap-1 !font-normal !text-gray-400"
              color="neutral"
              size="sm"
              variant="outlined"
            >
              {t("view")} <i className="ri-arrow-right-line" />
            </Button>
          </WrapperCard>
        ))}
      </section>
    </div>
  );
}

const searchData = [
  {
    value: "10210",
    translationKey: "totalLandCount",
  },
  {
    value: "2513",
    translationKey: "pendingLandForSaleCount",
  },
  {
    value: "124",
    translationKey: "landPurchase24h",
  },
  {
    value: "554",
    translationKey: "landSell24h",
  },
  {
    value: "1124",
    translationKey: "latestLandDealPrice",
  },
];
