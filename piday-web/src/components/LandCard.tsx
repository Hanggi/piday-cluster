import { Chip } from "@mui/joy";

import Image from "next/image";

import { ComponentProps } from "react";
import { useTranslation } from "react-i18next";

type LandCardProps = ComponentProps<"div">;

export function LandCard({ className, ...props }: LandCardProps) {
  const { t } = useTranslation("home");

  return (
    <div className="flex flex-col items-stretch max-md:w-full max-md:ml-0">
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

          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/c7b2c629ce7d4b74f6c3c18575d5779dd5f727de5abeab34655c42423ad2bb32?apiKey=13cc781f22ed46d5a94fbf5d79ccfd19&"
            className="aspect-[2.23] object-contain object-center w-[167px] overflow-hidden ml-4 mt-3 self-start max-md:ml-2.5"
          />
        </div>
        <div className="text-black text-base font-semibold whitespace-nowrap ml-5 mt-5 self-start max-md:ml-2.5">
          United Arab Emirates
        </div>
        <div className="text-black text-opacity-40 text-sm whitespace-nowrap ml-5 self-start max-md:ml-2.5">
          The day before
        </div>
        <div className="items-stretch flex gap-2.5 ml-5 mt-3 self-start max-md:ml-2.5">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/9ac0c18611a548f6e3b881c6c470a6ee932095d0100e7530204190b17d67d7c0?apiKey=13cc781f22ed46d5a94fbf5d79ccfd19&"
            className="aspect-square object-contain object-center w-6 overflow-hidden shrink-0 max-w-full"
          />
          <div className="text-black text-base grow whitespace-nowrap self-start">
            30
          </div>
        </div>
      </div>
    </div>
  );
}
