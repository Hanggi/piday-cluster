import * as RadixTab from "@radix-ui/react-tabs";
import { cn } from "@/src/utils/cn";

import Image from "next/image";

import { ComponentProps } from "react";

import { TabListDataType } from "../page";

type TabListProps = ComponentProps<typeof RadixTab.List> & {
  tabListData: TabListDataType[];
};

export function TabList({ className, tabListData, ...props }: TabListProps) {
  return (
    <RadixTab.List className={cn("container", className)} {...props}>
      {tabListData.map((tab) => (
        <>
          <RadixTab.Trigger key={tab.label} value={tab.label}>
            <Image alt={tab.label} height={34} src={tab.icon} width={34} />
            {tab.label}
          </RadixTab.Trigger>
          <div className="text-secondary/10 text-2xl font-medium">/</div>
        </>
      ))}
    </RadixTab.List>
  );
}
