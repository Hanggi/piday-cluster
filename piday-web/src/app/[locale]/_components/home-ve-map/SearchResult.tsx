"use client";

import { WrapperCard } from "@/src/components/WrapperCard";
import { cn } from "@/src/utils/cn";

import { Stack, Typography } from "@mui/joy";

import { ComponentProps } from "react";
import { useTranslation } from "react-i18next";

type SearchResultProps = ComponentProps<"div">;

export function SearchResult({ className, ...props }: SearchResultProps) {
  const { t } = useTranslation("home");
  return (
    <div className={cn("", className)} {...props}>
      <Typography level="h4" className="text-center py-10">
        {t("userCount")}（189898） {t("landOwnersCount")}（39824）{" "}
        {t("onlineUsersCount")}（12289）
      </Typography>
      <Stack direction={"row"} justifyContent={"center"} gap={2}>
        {searchData.map((data) => (
          <WrapperCard>
            <Typography>{data.value}</Typography>
          </WrapperCard>
        ))}
      </Stack>
    </div>
  );
}

const searchData = [
  {
    value: "10210个",
    translationKey: "totalLandCount",
  },
  {
    value: "2513个",
    translationKey: "pendingLandForSaleCount",
  },
  {
    value: "124个",
    translationKey: "landPurchase24h",
  },
  {
    value: "554个",
    translationKey: "landSell24h",
  },
  {
    value: "1124PI",
    translationKey: "latestLandDealPrice",
  },
];
