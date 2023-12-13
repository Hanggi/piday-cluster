"use client";

import VirtualEstateMap from "@/src/components/virtual-estate-map/VirtualEstateMap";
import { hexIDtoDecimal } from "@/src/components/virtual-estate-map/h3";
import {
  setInitialMapAnimation,
  showInitialMapAnimationValue,
} from "@/src/features/virtual-estate/virtual-estate-slice";

import { usePathname, useRouter } from "next/navigation";

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

  const dispatch = useDispatch();
  const showInitialMapAnimation = useSelector(showInitialMapAnimationValue);

  return (
    <div>
      <VirtualEstateMap
        defaultHexID={defaultHexID}
        token={token}
        withoutAnimation={!showInitialMapAnimation}
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
