"use client";

import { myVirtualEstatesCountValue } from "@/src/features/virtual-estate/virtual-estate-slice";

import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

interface Props {}

export const MyAssetsBanner = ({}: Props) => {
  const { t } = useTranslation("asset-center");
  const router = useRouter();

  const myVirtualEstatesCount = useSelector(myVirtualEstatesCountValue);

  return (
    <div className=" h-[220px] bg-gradient-to-r grid place-content-center from-purple-400 to-purple-800 rounded-lg">
      <div className=" h-36 w-36 relative flex flex-col gap-4 items-center">
        <Typography className="relative z-10 !text-white" level="h2">
          {myVirtualEstatesCount || 0}
        </Typography>
        <Typography className="relative z-10 !text-white">
          {t("landOwnershipCount")}
        </Typography>
        <Button
          className="relative z-10 !bg-transparent !min-w-[200px] !text-primary"
          variant="outlined"
          onClick={() => {
            router.push("/market");
          }}
        >
          {t("goToMarket")}
        </Button>
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
