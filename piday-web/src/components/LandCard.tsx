import Chip from "@mui/joy/Chip";
import Typography from "@mui/joy/Typography";

import Image from "next/image";
import Link from "next/link";

import { useTranslation } from "react-i18next";

import { VirtualEstate } from "../features/virtual-estate/interface/virtual-estate.interface";
import PiCoinLogo from "./piday-ui/PiCoinLogo";
import { hexIDtoDecimal } from "./virtual-estate-map/h3";

interface Props {
  ve: VirtualEstate;
}

export function VirtualEstateCard({ ve }: Props) {
  const { t } = useTranslation("home");

  console.log(ve);
  return (
    <div className="flex flex-col items-stretch max-md:w-full max-md:ml-0">
      <Link href={`/ve/${hexIDtoDecimal(ve.virtualEstateID)}`}>
        <div className="shadow-sm bg-gray-50 flex w-full grow flex-col mx-auto pb-5 rounded-2xl max-md:mt-7">
          <div className="flex-col overflow-hidden self-stretch relative flex aspect-[1.5] w-full pl-20 pr-4 pt-4 pb-12 items-end max-md:pl-5">
            <Image
              alt="map"
              className="absolute h-full w-full object-cover object-center inset-0"
              height={180}
              src="/img/map/map.png"
              width={280}
            />
            {ve.isGenesis && (
              <Chip className="relative !py-2 !text-yellow-200 !text-xs !rounded !bg-violet-600">
                {t("genesisLand")}
              </Chip>
            )}

            <Image
              alt="pid"
              className="absolute inset-0 m-auto"
              height={140}
              src={"/img/map/globe.svg"}
              width={140}
            />
          </div>
          <div className="px-4 pt-4 flex flex-col gap-3">
            <div className="h-12">
              <Typography level="title-lg">{ve?.name}</Typography>
            </div>
            <Typography level="body-sm">{ve?.virtualEstateID}</Typography>

            <div className="flex justify-between">
              <div className="flex gap-2.5">
                <div className="relative w-6 h-6">
                  <PiCoinLogo />
                </div>
                <Typography level="title-lg">
                  {getVirtualEstatePrice(ve)}
                </Typography>
              </div>
              <div>
                <Chip variant="outlined">{getVirtualEstateStatus(ve)}</Chip>
              </div>
            </div>
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
      </Link>
    </div>
  );
}

function getVirtualEstatePrice(ve: VirtualEstate) {
  // Find a listing item which has type of "ASK" listing items from the ve.listings, and return the price.
  const askListing = ve?.listings?.find((listing) => listing.type === "ASK");
  if (askListing) {
    return askListing?.price;
  }

  return ve?.lastPrice;
}

function getVirtualEstateStatus(ve: VirtualEstate) {
  const askListing = ve?.listings?.find((listing) => listing.type === "ASK");
  if (askListing) {
    return "在出售";
  }

  const bidListing = ve?.listings?.find((listing) => listing.type === "BID");
  if (bidListing) {
    return "在拍卖";
  }

  return "已铸造";
}
