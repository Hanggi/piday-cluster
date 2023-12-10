"use client";

import * as RadixTab from "@radix-ui/react-tabs";
import { WrapperCard } from "@/src/components/WrapperCard";

import { TabList } from "./LandCategoriesList";
import { TabContent } from "./LandContent";

export const LandByCategories = () => {
  return (
    <WrapperCard>
      <RadixTab.Root defaultValue={categories[0]}>
        <TabList categories={categories} />
        <TabContent tabList={categories.map((tab) => tab)} />
      </RadixTab.Root>
    </WrapperCard>
  );
};

const categories: string[] = [
  "totalLand",
  "minted",
  "sold",
  "forSale",
  "owned",
];
