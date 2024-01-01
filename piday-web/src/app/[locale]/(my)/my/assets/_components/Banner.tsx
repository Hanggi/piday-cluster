"use client";

import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";

import Image from "next/image";

import { useTranslation } from "react-i18next";

export const MyAssetsBanner = () => {
  const { t } = useTranslation("asset-center");
  return (
    <div className=" h-[220px] bg-gradient-to-r grid place-content-center from-purple-400 to-purple-800 rounded-lg">
      <div className=" h-36 w-36 relative flex flex-col gap-4 items-center">
        <Typography className="relative z-10 !text-white" level="h2">
          24
        </Typography>
        <Typography className="relative z-10 !text-white">
          {t("landOwnershipCount")}
        </Typography>
        <Button
          className="relative z-10 !bg-transparent !min-w-[200px] !text-primary"
          variant="outlined"
        >
          {t("goToMarket")}
        </Button>{" "}
        <Image
          alt=""
          className="absolute inset-0 scale-125 opacity-20"
          height={200}
          src="/img/mining/dashboard.svg"
          width={200}
        />
      </div>
    </div>
  );
};
