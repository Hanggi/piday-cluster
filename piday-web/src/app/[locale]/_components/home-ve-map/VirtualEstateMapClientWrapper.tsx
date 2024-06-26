"use client";

import VirtualEstateMap from "@/src/components/virtual-estate-map/VirtualEstateMap";
import { hexIDtoDecimal } from "@/src/components/virtual-estate-map/h3";
import { useGetHexIDsStatusInAreaQuery } from "@/src/features/virtual-estate/api/virtualEstateAPI";
import {
  setInitialMapAnimation,
  showInitialMapAnimationValue,
} from "@/src/features/virtual-estate/virtual-estate-slice";

import { usePathname, useRouter } from "next/navigation";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface Props {
  token: string;
  defaultHexID?: string;
}

export default function VirtualEstateMapClientWrapper({
  token,
  defaultHexID,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const [currentCenterHexID, setCurrentCenterHexID] = useState(
    defaultHexID as string,
  );

  const dispatch = useDispatch();
  const showInitialMapAnimation = useSelector(showInitialMapAnimationValue);

  const { data: hexIDsStatus } = useGetHexIDsStatusInAreaQuery({
    hexID: currentCenterHexID,
  });

  return (
    <div className="relative h-full">
      <VirtualEstateMap
        defaultHexID={defaultHexID}
        soldList={hexIDsStatus?.sold || []}
        token={token}
        withoutAnimation={!showInitialMapAnimation}
        onCenterHexChange={(hexID) => {
          setCurrentCenterHexID(hexID);
        }}
        onSaleList={hexIDsStatus?.onSale || []}
        onVirtualEstateClick={(hexID) => {
          const decimalID = hexIDtoDecimal(hexID);
          router.push(`/ve/${decimalID}`);

          if (pathname.includes("/ve")) {
            dispatch(setInitialMapAnimation(false));
          } else {
            dispatch(setInitialMapAnimation(true));
          }
        }}
      />
    </div>
  );
}
