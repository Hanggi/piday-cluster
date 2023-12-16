import * as RadixTab from "@radix-ui/react-tabs";
import { LandCard } from "@/src/components/LandCard";
import { Pagination } from "@/src/components/Pagination";
import { useGetMyVirtualEstatesQuery } from "@/src/features/virtual-estate/api/virtualEstateAPI";
import { VirtualEstate } from "@/src/features/virtual-estate/interface/virtual-estate.interface";
import { cn } from "@/src/utils/cn";

import { ComponentProps } from "react";

import { TabListDataType } from "../../ranking/page";

type TabContentProps = ComponentProps<"div"> & {
  tabList: TabListDataType["label"][];
};
export function TabContent({ className, tabList, ...props }: TabContentProps) {
  const { data } = useGetMyVirtualEstatesQuery({ page: "1", size: "2" });
  console.log("Data", data);
  return (
    <div className={cn("container ", className)} {...props}>
      {tabList.map((tab) => (
        <RadixTab.Content
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          key={tab}
          value={tab}
        >
          {data &&
            data?.map((singleVirtualEstate: VirtualEstate) => {
              return <LandCard key={singleVirtualEstate.id} />;
            })}
          <Pagination className="col-span-full my-2" />
        </RadixTab.Content>
      ))}
    </div>
  );
}
