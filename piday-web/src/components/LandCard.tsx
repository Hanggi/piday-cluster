import { Chip } from "@mui/joy";

import Image from "next/image";

import { ComponentProps } from "react";
import { useTranslation } from "react-i18next";

type LandCardProps = ComponentProps<"div">;

export function LandCard({ className, ...props }: LandCardProps) {
  const { t } = useTranslation("home");

  return (
    <div
      {...props}
      className="flex flex-col items-stretch max-md:w-full max-md:ml-0"
    >
      <div className="shadow-sm bg-gray-50 flex w-full grow flex-col mx-auto pb-5 rounded-2xl max-md:mt-7">
        <div className="flex-col overflow-hidden self-stretch relative flex aspect-[1.5] w-full pl-20 pr-4 pt-4 pb-12 items-end max-md:pl-5">
          <Image
            alt="map"
            width={280}
            height={180}
            src="/img/map/map.png"
            className="absolute h-full w-full object-cover object-center inset-0"
          />
          <Chip className="relative !py-2 !text-white !text-xs !rounded !bg-sky-500">
            {t("genesisLand")}
          </Chip>

          <Image
            src={"/img/map/globe.svg"}
            alt="pid"
            width={140}
            height={140}
            className="absolute inset-0 m-auto"
          />
        </div>
        <p className="font-semibold ml-5 mt-5 max-md:ml-2.5">
          United Arab Emirates
        </p>
        <p className="text-black/40 text-sm ml-5 max-md:ml-2.5">
          The day before
        </p>
        <div className="flex gap-2.5 ml-5 mt-3 max-md:ml-2.5">
          <Image
            src={"/img/icons/pid.png"}
            alt="pid"
            width={24}
            height={24}
            className="aspect-square object-contain object-center w-6 overflow-hidden shrink-0 max-w-full"
          />
          <span>30</span>
        </div>
      </div>
    </div>
  );
}
