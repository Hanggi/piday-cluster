import Chip from "@mui/joy/Chip";

import Image from "next/image";

import { useTranslation } from "react-i18next";

import { VirtualEstate } from "../features/virtual-estate/interface/virtual-estate.interface";
import PiCoinLogo from "./piday-ui/PiCoinLogo";

interface Props {
  ve: VirtualEstate;
}

export function VirtualEstateCard({ ve }: Props) {
  const { t } = useTranslation("home");

  console.log(ve);
  return (
    <div className="flex flex-col items-stretch max-md:w-full max-md:ml-0">
      <div className="shadow-sm bg-gray-50 flex w-full grow flex-col mx-auto pb-5 rounded-2xl max-md:mt-7">
        <div className="flex-col overflow-hidden self-stretch relative flex aspect-[1.5] w-full pl-20 pr-4 pt-4 pb-12 items-end max-md:pl-5">
          <Image
            alt="map"
            className="absolute h-full w-full object-cover object-center inset-0"
            height={180}
            src="/img/map/map.png"
            width={280}
          />
          <Chip className="relative !py-2 !text-white !text-xs !rounded !bg-sky-500">
            {t("genesisLand")}
          </Chip>

          <Image
            alt="pid"
            className="absolute inset-0 m-auto"
            height={140}
            src={"/img/map/globe.svg"}
            width={140}
          />
        </div>
        <div className="px-4 pt-4 flex flex-col gap-3">
          <p className="font-semibold">United Arab Emirates</p>
          <p className="text-black/40 text-sm -mt-2">{ve?.virtualEstateID}</p>
          <div className="flex gap-2.5">
            <div className="relative w-6 h-6">
              <PiCoinLogo />
            </div>
            <span>30</span>
          </div>{" "}
          {/* {noBtn ?? (
            <Button
              className="relative z-10 !bg-transparent !min-w-[200px]  !text-primary"
              variant="outlined"
            >
              已铸造
            </Button>
          )} */}
        </div>
      </div>
    </div>
  );
}
