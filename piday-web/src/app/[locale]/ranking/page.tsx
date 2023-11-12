"use client";

import * as RadixTab from "@radix-ui/react-tabs";

import { TabContent } from "./_components/TabContent";
import { TabList } from "./_components/TabList";

export default function RankingPage() {
  return (
    <section>
      <RadixTab.Root defaultValue={tabListData[0].label}>
        <TabList tabListData={tabListData as any} />
        <TabContent tabList={tabListData.map((tab) => tab.label)} />
      </RadixTab.Root>
    </section>
  );
}

export type TabListDataType = {
  icon: string;
  label: string;
};

const tabListData: TabListDataType[] = [
  {
    icon: "/img/icons/globe.png",
    label: "ranking:tabs.country",
  },
  {
    icon: "/img/icons/User.png",
    label: "ranking:tabs.personal",
  },
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
    label: "ranking:tabs.transaction",
  },
];
