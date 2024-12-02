import { WrapperCard } from "@/src/components/WrapperCard";
import {
  decimalToHexID,
  hexIDtoDecimal,
} from "@/src/components/virtual-estate-map/h3";
import instance from "@/src/features/axios/instance";
import { VirtualEstateListing } from "@/src/features/virtual-estate-listing/interface/virtual-estate-listing.interface";
import { VirtualEstate } from "@/src/features/virtual-estate/interface/virtual-estate.interface";
import { getAccessToken } from "@/src/utils/sessionTokenAccessor";
import { AxiosError } from "axios";
import { isNaN, isNumber } from "lodash";

import { redirect } from "next/navigation";

import VirtualEstateMapClientWrapper from "../../_components/home-ve-map/VirtualEstateMapClientWrapper";
import VirtualEstateDetailCard from "./_components/VirtualEstateDetailCard";
import VirtualEstateListings from "./_components/VirtualEstateListings";
import { VirtualEstateTradingHisory } from "./_components/VirtualEstateTradingHistory";

const MAPBOX_ACCESS_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;

interface Props {
  params: Promise<{ decimalID: string }>;
}

export default async function VirtualEstateDetailPage({ params }: Props) {
  const { decimalID } = await params;

  // if decimalID is not a decimal number then it's a hexID
  if (isNaN(+decimalID) || !isNumber(+decimalID)) {
    const deciamlPathID = hexIDtoDecimal(decimalID);

    redirect(`/ve/${deciamlPathID}`);
  }

  const hexID = decimalToHexID(decimalID);

  let virtualEstate: VirtualEstate | undefined;
  let onSaleListing: VirtualEstateListing | undefined;
  let mintPrice = 3.14;
  try {
    const accessTokenDecrypted = await getAccessToken();

    // This request send to the backend directly.
    const res = await instance.get(`/virtual-estates/${hexID}`, {
      headers: {
        Authorization: accessTokenDecrypted
          ? `Bearer ${accessTokenDecrypted}`
          : "",
      },
    });

    console.log(res.data);
    mintPrice = res.data.mintPrice;
    virtualEstate = res.data.ve;
    onSaleListing = res.data.listing;
  } catch (err) {
    const axiosError = err as AxiosError;
    console.error(axiosError?.response?.data);
  }

  return (
    <main className="">
      <div className="mb-8">
        <WrapperCard className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-5 py-4 ">
          <div className="w-full aspect-square max-h-[500px] relative rounded-lg overflow-hidden">
            <VirtualEstateMapClientWrapper
              defaultHexID={hexID}
              token={MAPBOX_ACCESS_TOKEN as string}
            />
          </div>
          <VirtualEstateDetailCard
            hexID={hexID}
            listing={onSaleListing}
            mintPrice={mintPrice}
            virtualEstate={virtualEstate}
          />
        </WrapperCard>
      </div>
      <div className="mb-8">
        <VirtualEstateListings hexID={hexID} virtualEstate={virtualEstate} />
      </div>
      <div className="mb-8">
        <VirtualEstateTradingHisory hexID={hexID} />
      </div>
      <br />
    </main>
  );
}
