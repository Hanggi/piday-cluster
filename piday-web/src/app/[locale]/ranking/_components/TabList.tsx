import * as RadixTab from "@radix-ui/react-tabs";
import { cn } from "@/src/utils/cn";

import { ComponentProps } from "react";

import { TabListDataType } from "../page";

type TabListProps = ComponentProps<typeof RadixTab.List> & {
  tabListData: TabListDataType[];
};

export function TabList({ className, tabListData, ...props }: TabListProps) {
  return (
    <RadixTab.List className={cn("container", className)} {...props}>
      {tabListData.map((tab) => (
        <RadixTab.Trigger key={tab.label} value={tab.label}>
          {tab.label}
        </RadixTab.Trigger>
      ))}
    </RadixTab.List>
  );
}
