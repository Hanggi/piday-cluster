import instance from "@/src/features/axios/instance";
import { Statistics } from "@/src/features/virtual-estate/interface/statistics.interface";
import { AxiosError } from "axios";

import { cache } from "react";

import { ForSale } from "./_components/home-ve-map/ForSale";
import { SearchResult } from "./_components/home-ve-map/SearchResult";
import VirtualEstateMapClientWrapper from "./_components/home-ve-map/VirtualEstateMapClientWrapper";

const MAPBOX_ACCESS_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;

interface Props {
  // params: Promise<{ hexID: string }>;
}

declare global {
  interface Window {
    Pi: any;
  }
}

export default async function HomePage() {
  const statistics = await getStatitics();

  return (
    <section className="container mx-auto py-4 px-0 mb-8">
      <div className="w-full h-[400px] lg:h-[800px] relative pb-8">
        <VirtualEstateMapClientWrapper token={MAPBOX_ACCESS_TOKEN as string} />
      </div>

      <SearchResult statistics={statistics} />
      <ForSale />
    </section>
  );
}

export const revalidate = 10;

const getStatitics = cache(async (): Promise<Statistics> => {
  try {
    // This request send to the backend directly.
    const res = await instance.get(`/virtual-estates/statistics`);
    return res.data.statistics;
  } catch (err) {
    const axiosError = err as AxiosError;
    console.error(axiosError?.response?.data);
    return {
      totalVirtualEstatesMinted: 0,
      virtualEstateListingCount: 0,
      totalTransactionVolume: "0",
      transactionRecordsCount: 0,
    };
  }
});
