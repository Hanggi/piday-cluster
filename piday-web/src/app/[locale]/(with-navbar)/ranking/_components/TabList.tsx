import * as RadixTab from "@radix-ui/react-tabs";
import { cn } from "@/src/utils/cn";

import Image from "next/image";

import { ComponentProps } from "react";
import { useTranslation } from "react-i18next";

import { TabListDataType } from "../page";

type TabListProps = ComponentProps<typeof RadixTab.List> & {
  tabListData: TabListDataType[];
};

export function TabList({ className, tabListData, ...props }: TabListProps) {
  const { t } = useTranslation("ranking");
  return (
    <RadixTab.List
      className={cn("container gap-1 flex items-center mb-6", className)}
      {...props}
    >
      {tabListData.map((tab) => (
        <>
          <RadixTab.Trigger
            className="grow flex flex-col rounded-xl max-w-[160px] mx-auto aria-selected:bg-white/40 py-3 gap-1.5 group items-center"
            key={tab.label}
            value={tab.label}
          >
            <Image
              alt={tab.label}
              className="group-aria-selected:grayscale-0 grayscale"
              height={34}
              src={tab.icon}
              width={34}
            />
            <h4 className="group-aria-selected:text-secondary capitalize max-md:hidden text-xl font-medium">
              {t(tab.label)}
            </h4>
          </RadixTab.Trigger>
          <div className="text-secondary/20 last:hidden text-2xl font-medium">
            /
          </div>
        </>
      ))}
    </RadixTab.List>
  );
}
