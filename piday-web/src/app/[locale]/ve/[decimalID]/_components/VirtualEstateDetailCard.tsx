"use client";

import { useGetPlacesQuery } from "@/src/features/virtual-estate/api/mapboxAPI";
import { useGetOneVirtualEstateQuery } from "@/src/features/virtual-estate/api/virtualEstateAPI";
import { h3ToGeo } from "h3-js";

import Button from "@mui/joy/Button";

interface Props {
  hexID: string;
}

export default function VirtualEstateDetailCard({ hexID }: Props) {
  const geo = h3ToGeo(hexID);
  const { data: place } = useGetPlacesQuery({
    lat: geo[0],
    lng: geo[1],
  });

  const { data: virtualEstate } = useGetOneVirtualEstateQuery({ hexID });
  console.log(virtualEstate);

  return (
    <div className="w-full relative pt-5">
      <h1 className="text-3xl font-semibold">country.country</h1>
      <div className="mt-5 p-6 bg-[#F7F7F7] rounded-xl">
        <div className="grid grid-cols-2 py-5">
          <div>
            <p className="opacity-40">地址</p>
            <p>{place?.features[0].place_name}</p>
          </div>
          <div>
            <p className="opacity-40">哈希值</p>
            <p>{hexID}</p>
          </div>
        </div>
        <hr />
        <div className="grid grid-cols-2 py-5">
          <div>
            <p className="opacity-40">土地铸造时间</p>
            <p>2023-08-25 16:00:21</p>
          </div>
          <div>
            <p className="opacity-40">持有人</p>
            <p>张三</p>
          </div>
        </div>
        <hr />
        <div className="py-5">
          <p className="opacity-40">最后价格</p>
          <h1 className="text-2xl">150</h1>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-7">
        <Button className="py-3 grow" size="lg">
          上架
        </Button>
        <Button className="py-3 grow" size="lg">
          转移
        </Button>
      </div>
    </div>
  );
}
