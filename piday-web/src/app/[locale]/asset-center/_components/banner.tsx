"use client";

import { Button } from "@mui/joy";

import Image from "next/image";

import { useTranslation } from "react-i18next";

export const Banner = () => {
  const { t } = useTranslation("asset-center");
  return (
    <header className=" h-[220px] bg-gradient-to-r grid place-content-center from-purple-400 to-purple-800 rounded-lg">
      <div className="text-white relative flex flex-col gap-4 items-center">
        <h4 className="relative z-10 text-5xl font-bold">24</h4>
        <p className="relative z-10 text-sm ">{t("landOwnershipCount")}</p>
        <Button
          variant="outlined"
          className="relative z-10 !bg-transparent !min-w-[200px] !text-primary"
        >
          {t("goToMarket")}
        </Button>{" "}
        <Image
          src="/img/mining/dashboard.svg"
          className="absolute inset-0 scale-125 opacity-20"
          width={200}
          height={200}
          alt=""
        />
      </div>
    </header>
  );
};
