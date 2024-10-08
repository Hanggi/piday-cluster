"use client";

import * as RadixTab from "@radix-ui/react-tabs";

import { TabListDataType } from "../page";
import { TabContent } from "./TabContent";
import { TabList } from "./TabList";

export const RankingTab = () => {
  return (
    <RadixTab.Root defaultValue={tabListData[0].label}>
      <TabList tabListData={tabListData as any} />
      <TabContent tabList={tabListData.map((tab) => tab.label)} />
    </RadixTab.Root>
  );
};

const tabListData: TabListDataType[] = [
  {
    icon: "/img/icons/UsersThree.png",
    label: "ranking:tabs.invitation",
  },
  {
    icon: "/img/icons/pid.png",
    label: "ranking:tabs.commission",
  },
  {
    icon: "/img/icons/Medal.png",
    label: "ranking:tabs.points",
  },
];
