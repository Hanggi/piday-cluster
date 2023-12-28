import * as RadixTab from "@radix-ui/react-tabs";
import { cn } from "@/src/utils/cn";

import { Button } from "@mui/joy";

import { ComponentProps } from "react";
import { useTranslation } from "react-i18next";

type TabListProps = ComponentProps<typeof RadixTab.List> & {
  categories: string[];
};

export function TabList({ className, categories, ...props }: TabListProps) {
  const { t } = useTranslation("asset-center");
  return (
    <RadixTab.List
      className={cn(
        "container overflow-auto gap-5 flex items-center mb-6",
        className,
      )}
      {...props}
    >
      {categories.map((tab) => (
        <>
          <RadixTab.Trigger asChild key={tab} value={tab}>
            <Button className="!rounded-full whitespace-nowrap !text-stone-600 aria-selected:!text-black aria-selected:!bg-primary !bg-transparent">
              {t(tab)}
            </Button>
          </RadixTab.Trigger>
        </>
      ))}
    </RadixTab.List>
  );
}
