import * as RadixTab from "@radix-ui/react-tabs";
import { cn } from "@/src/utils/cn";

import { ComponentProps } from "react";

import { TabListDataType } from "../page";
import { RankingTable } from "./RankingTable";
import { RankDataKey } from "./rankData";

type TabContentProps = ComponentProps<"div"> & {
  tabList: TabListDataType["label"][];
};
export function TabContent({ className, tabList, ...props }: TabContentProps) {
  return (
    <div className={cn("container", className)} {...props}>
      {tabList.map((tab) => (
        <RadixTab.Content key={tab} value={tab}>
          <RankingTable
            dataKey={tab.split("ranking:tabs.")[1] as RankDataKey}
          />
        </RadixTab.Content>
      ))}
      <RadixTab.Content value={tabList[1]}>bollo</RadixTab.Content>
    </div>
  );
}
