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

export type TabListDataType = (typeof tabListData)[number];

const tabListData = [
  {
    icon: "/img/icons/globe.png",
    label: "国家排名",
  },
  {
    icon: "/img/icons/User.png",
    label: "个人排名",
  },
  {
    icon: "/img/icons/UsersThree.png",
    label: "邀请排名",
  },
  {
    icon: "/img/icons/pid.png",
    label: "佣金排名",
  },
  {
    icon: "/img/icons/Medal.png",
    label: "成交排名",
  },
] as const;
