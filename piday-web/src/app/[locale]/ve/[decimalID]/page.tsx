import { decimalToHexID } from "@/src/components/virtual-estate-map/h3";

import VirtualEstateMapClientWrapper from "../../_components/home-ve-map/VirtualEstateMapClientWrapper";
import { Table } from "./_components/Table";
import VirtualEstateDetailCard from "./_components/VirtualEstateDetailCard";

const MAPBOX_ACCESS_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;

interface Props {
  params: { decimalID: string };
}

export default function VirtualEstateDetailPage({
  params: { decimalID },
}: Props) {
  const hexID = decimalToHexID(decimalID);

  return (
    <main>
      <div className="container mx-auto h-screen grid grid-cols-1 md:grid-cols-2 gap-5 py-4 ">
        <div className="w-full max-h-[500px] relative rounded-lg">
          <VirtualEstateMapClientWrapper
            defaultHexID={hexID}
            token={MAPBOX_ACCESS_TOKEN as string}
          />
        </div>
        <VirtualEstateDetailCard hexID={hexID} />
      </div>
      <Table />
      <br />
    </main>
  );
}
