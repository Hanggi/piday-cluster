import instance from "@/src/features/axios/instance";
import { Statistics } from "@/src/features/virtual-estate/interface/statistics.interface";
import { AxiosError } from "axios";

import { ForSale } from "./_components/home-ve-map/ForSale";
import { SearchResult } from "./_components/home-ve-map/SearchResult";
import VirtualEstateMapClientWrapper from "./_components/home-ve-map/VirtualEstateMapClientWrapper";

export const metadata = {
  title: "Home",
};

const MAPBOX_ACCESS_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;

interface Props {
  params: { hexID: string };
}

export default async function HomePage({ params }: Props) {
  let statistics: Statistics = {
    totalVirtualEstatesMinted: 0,
    virtualEstateListingCount: 0,
    totalTransactionVolume: "0",
    transactionRecordsCount: 0,
  };

  try {
    // This request send to the backend directly.
    const res = await instance.get(`/virtual-estates/statistics`);

    statistics = res.data.statistics;
  } catch (err) {
    const axiosError = err as AxiosError;
    console.error(axiosError?.response?.data);
  }

  return (
    <section className="container mx-auto  py-4 mb-8">
      <div className="w-full h-[800px] relative pb-8">
        <VirtualEstateMapClientWrapper token={MAPBOX_ACCESS_TOKEN as string} />
      </div>
      <SearchResult statistics={statistics} />
      <ForSale />
    </section>
  );
}
