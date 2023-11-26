"use client";

import { WrapperCard } from "@/src/components/WrapperCard";
import { cn } from "@/src/utils/cn";

import Image from "next/image";

import { ComponentProps } from "react";
import { useTranslation } from "react-i18next";

type InformationProps = ComponentProps<"div">;

export function Information({ className, ...props }: InformationProps) {
  const { t } = useTranslation("mining");
  return (
    <div
      className={cn("grid grid-cols-4 gap-5 grid-rows-2", className)}
      {...props}
    >
      <WrapperCard className="col-span-2 row-span-2">
        <p className="text-xl font-normal">{t("mining:information.title")}</p>
        <section className="md:grid-cols-3 mt-7 grid divide-x divide-zinc-100 gap-y-10">
          {informationData.map((info) => (
            <div
              className="nth-[3n+1]:pl-0 space-y-2 pl-6 md:pl-10 lg:pl-14 nth-[3n+1]:!border-l-0"
              key={info.translationKey}
            >
              <h4 className="text-black/40 ">{t(info.translationKey)}</h4>
              <h5 className="text-xl font-medium">{info.value}</h5>
            </div>
          ))}
        </section>
      </WrapperCard>
      {pointsData.map((data) => (
        <WrapperCard className="relative" key={data.translationKey}>
          <h4 className="text-black/40">{t(data.translationKey)}</h4>
          <p className="text-secondary text-[32px]">{t(data.value)}</p>
          <Image
            alt="icon"
            className="absolute right-0 bottom-0 opacity-10"
            height={106}
            src={data.image}
            width={106}
          />
        </WrapperCard>
      ))}
    </div>
  );
}

const informationData = [
  {
    translationKey: "mining:information.accountRegistrationTime",
    value: "2023-09-05",
  },
  {
    translationKey: "mining:information.miningDays",
    value: "32",
  },
  {
    translationKey: "mining:information.numberOfPeopleInvited",
    value: "13",
  },
  {
    translationKey: "mining:information.nftHolding",
    value: "2124",
  },
  {
    translationKey: "mining:information.landHolding",
    value: "22214",
  },
];

const pointsData = [
  {
    translationKey: "mining:information.totalPoints",
    value: "21547",
    image: "/img/mining/database.svg",
  },
  {
    translationKey: "mining:information.basicPoints",
    value: "122",
    image: "/img/mining/database.svg",
  },
  {
    translationKey: "mining:information.invitationPoints",
    value: "21",
    image: "/img/mining/email.svg",
  },
  {
    translationKey: "mining:information.landPoints",
    value: "213",
    image: "/img/mining/dashboard.svg",
  },
];
