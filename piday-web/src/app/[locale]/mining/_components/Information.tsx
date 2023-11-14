"use client";

import { Wrapper } from "@/src/components/Wrapper";
import { cn } from "@/src/utils/cn";

import { ComponentProps } from "react";
import { useTranslation } from "react-i18next";

type InformationProps = ComponentProps<"div">;

export function Information({ className, ...props }: InformationProps) {
  const { t } = useTranslation("mining");
  return (
    <div className={cn("grid grid-cols-4 grid-rows-2", className)} {...props}>
      <Wrapper className="col-span-2 row-span-2">
        <p className="text-xl font-normal">{t("mining:information.title")}</p>
        <section className="grid-cols-3 grid divide-x-2">
          {informationData.map((info) => (
            <div className="nth-[3n+1]:bg-red-200" key={info.translationKey}>
              <h4 className="text-black/40 ">{t(info.translationKey)}</h4>
              <h5 className="text-xl font-medium">{info.value}</h5>
            </div>
          ))}
        </section>
      </Wrapper>
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
