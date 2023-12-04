"use client";

import VirtualEstateMap from "@/src/components/virtual-estate-map/VirtualEstateMap";
import { hexIDtoDecimal } from "@/src/components/virtual-estate-map/h3";

import { useRouter } from "next/navigation";

interface Props {
  token: string;
}

export default function HomeVirtualEstateMap({ token }: Props) {
  const router = useRouter();

  return (
    <div className="h-full">
      <VirtualEstateMap
        token={token}
        onVirtualEstateClick={(hexID) => {
          const decimal = hexIDtoDecimal(hexID);
          router.push(`/ve/${decimal}`);
        }}
      />
    </div>
  );
}
