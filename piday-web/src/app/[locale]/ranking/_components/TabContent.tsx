import * as RadixTab from "@radix-ui/react-tabs";
import { cn } from "@/src/utils/cn";

import { ComponentProps } from "react";

import { TabListDataType } from "../page";
import { RankingTable } from "./RankingTable";

type TabContentProps = ComponentProps<"div"> & {
  tabList: TabListDataType["label"][];
};
export function TabContent({ className, tabList, ...props }: TabContentProps) {
  return (
    <div className={cn("container", className)} {...props}>
      <RadixTab.Content value={tabList[0]}>
        <RankingTable />
      </RadixTab.Content>
      <RadixTab.Content value="个人排名">bollo</RadixTab.Content>
    </div>
  );
}
