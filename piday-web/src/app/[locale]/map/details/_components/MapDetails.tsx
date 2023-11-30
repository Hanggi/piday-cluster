"use client";

import { MapContext } from "@/src/contexts/MapProvider";

import { useContext, useState } from "react";

import HexagonMap from "../../_components/HeaxagonMap";

type addressState = {
  [key: string]: any;
};

export const MapDetails = () => {
  const { newPlace, country } = useContext(MapContext);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 py-4">
      <div className="w-full relative rounded-lg">
        <HexagonMap newPlace={newPlace} />
      </div>
      <div className="w-full relative pt-5">
        <h1 className="text-3xl font-semibold">{country.country}</h1>
        <div className="mt-5 p-6 bg-[#F7F7F7] rounded-xl">
          <div className="grid grid-cols-2 py-5">
            <div>
              <p className="opacity-40">地址</p>
              <p>{country ? country.city : "Address not found"}</p>
            </div>
            <div>
              <p className="opacity-40">哈希值</p>
              <p>8a283082a89ffff</p>
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
          <button className="py-3 grow bg-primary rounded-xl">上架</button>
          <button className="py-3 grow border rounded-xl">转移</button>
        </div>
      </div>
    </div>
  );
};
