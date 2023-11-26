import * as RadixTab from "@radix-ui/react-tabs";
import { cn } from "@/src/utils/cn";

import { ComponentProps } from "react";

import { RankDataKey } from "../@types/rankData.type";
import { TabListDataType } from "../page";
import { RankingTable } from "./RankingTable";

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
    </div>
  );
}
