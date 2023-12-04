import VirtualEstateMap from "@/src/components/virtual-estate-map/VirtualEstateMap";
import { decimalToHexID } from "@/src/components/virtual-estate-map/h3";

import Button from "@mui/joy/Button";

const MAPBOX_ACCESS_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;

interface Props {
  params: { decimalID: string };
}

export default function VirtualEstateDetailPage({
  params: { decimalID },
}: Props) {
  const hexID = decimalToHexID(decimalID);

  return (
    <div className="container mx-auto h-screen grid grid-cols-1 md:grid-cols-2 gap-5 py-4 ">
      <div className="w-full max-h-[500px] relative rounded-lg">
        <VirtualEstateMap
          defaultHexID={hexID}
          token={MAPBOX_ACCESS_TOKEN as string}
        />
      </div>
      <div className="w-full relative pt-5">
        <h1 className="text-3xl font-semibold">country.country</h1>
        <div className="mt-5 p-6 bg-[#F7F7F7] rounded-xl">
          <div className="grid grid-cols-2 py-5">
            <div>
              <p className="opacity-40">地址</p>
              <p>Address not found</p>
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
    </div>
  );
}
