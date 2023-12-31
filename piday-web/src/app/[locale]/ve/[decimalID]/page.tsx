import { WrapperCard } from "@/src/components/WrapperCard";
import { decimalToHexID } from "@/src/components/virtual-estate-map/h3";
import instance from "@/src/features/axios/instance";
import { VirtualEstate } from "@/src/features/virtual-estate/interface/virtual-estate.interface";
import { AxiosError } from "axios";

import VirtualEstateMapClientWrapper from "../../_components/home-ve-map/VirtualEstateMapClientWrapper";
import VirtualEstateDetailCard from "./_components/VirtualEstateDetailCard";
import VirtualEstateListings from "./_components/VirtualEstateListings";
import { VirtualEstateTradingHisory } from "./_components/VirtualEstateTradingHistory";

const MAPBOX_ACCESS_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;

interface Props {
  params: { decimalID: string };
}

export default async function VirtualEstateDetailPage({
  params: { decimalID },
}: Props) {
  const hexID = decimalToHexID(decimalID);

  let virtualEstate: VirtualEstate | undefined;
  try {
    // This request send to the backend directly.
    const res = await instance.get(`/virtual-estates/${hexID}`);
    virtualEstate = res.data.ve;
  } catch (err) {
    const axiosError = err as AxiosError;
    console.error(axiosError?.response?.data);
  }

  return (
    <main>
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
            virtualEstate={virtualEstate}
          />
        </WrapperCard>
      </div>
      <div className="mb-8">
        <VirtualEstateListings hexID={hexID} virtualEstate={virtualEstate} />
      </div>
      <div className="mb-8">
        <VirtualEstateTradingHisory />
      </div>
      <br />
    </main>
  );
}
