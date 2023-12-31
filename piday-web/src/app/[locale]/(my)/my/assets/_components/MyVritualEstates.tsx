"use client";

import { VirtualEstateCard } from "@/src/components/LandCard";
import { WrapperCard } from "@/src/components/WrapperCard";
import Pagination from "@/src/components/piday-ui/pagination/Pagination";
import { useGetMyVirtualEstatesQuery } from "@/src/features/virtual-estate/api/virtualEstateAPI";
import { VirtualEstate } from "@/src/features/virtual-estate/interface/virtual-estate.interface";
import { setMyVirtualEstatesCount } from "@/src/features/virtual-estate/virtual-estate-slice";

import { useEffect } from "react";
import { useDispatch } from "react-redux";

interface Props {}

export const MyVritualEstates = ({}: Props) => {
  const dispatch = useDispatch();

  const { data: myVritualEstatesRes } = useGetMyVirtualEstatesQuery({
    page: 1,
    size: 20,
  });

  useEffect(() => {
    if (
      myVritualEstatesRes?.totalCount &&
      myVritualEstatesRes?.totalCount > 0
    ) {
      console.log(
        "myVritualEstatesRes?.totolCount",
        myVritualEstatesRes?.totalCount,
      );
      dispatch(setMyVirtualEstatesCount(myVritualEstatesRes?.totalCount));
    }
  }, [dispatch, myVritualEstatesRes?.totalCount]);

  return (
    <div>
      <WrapperCard>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {myVritualEstatesRes?.virtualEstates &&
            myVritualEstatesRes?.virtualEstates.map((ve: VirtualEstate, i) => {
              return (
                <div key={i}>
                  <VirtualEstateCard key={i} ve={ve} />
                </div>
              );
            })}
        </div>
        <Pagination currentPage={0} pageCount={0} />
      </WrapperCard>
    </div>
  );
};

const categories: string[] = [
  "totalLand",
  "minted",
  "sold",
  "forSale",
  "owned",
];
