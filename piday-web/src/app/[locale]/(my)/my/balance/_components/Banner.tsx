"use client";

import { useGetBalanceQuery } from "@/src/features/account/api/accountAPI";

import Typography from "@mui/joy/Typography";

import Image from "next/image";

import { useTranslation } from "react-i18next";

export const MyBalanceBanner = () => {
  const { t } = useTranslation(["asset-center"]);

  const { data: balance } = useGetBalanceQuery({});

  return (
    <div className=" h-[220px] bg-gradient-to-r grid place-content-center from-[#FFB800] to-[#FF7A00] rounded-lg">
      <div className="relative h-36 w-36 flex flex-col gap-4 items-center">
        <Typography className="z-10 !text-white" level="h2">
          {balance}
        </Typography>
        <Typography className="z-10 !text-white">
          {t("asset-center:title.myBalance")}
        </Typography>
        {/* <Button
          className="relative z-10 !bg-transparent !min-w-[200px] !text-primary"
          variant="outlined"
        >
          {t("goToMarket")}
        </Button>{" "} */}
        <Image
          alt=""
          className="absolute inset-0 scale-125 opacity-20"
          height={200}
          src="/img/mining/database.svg"
          width={200}
        />
      </div>
    </div>
  );
};
