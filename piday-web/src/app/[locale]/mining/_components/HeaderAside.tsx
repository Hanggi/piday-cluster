"use client";

import { Button } from "@mui/joy";

import { useTranslation } from "react-i18next";

export const HeaderAside = () => {
  const { t } = useTranslation("mining");
  return (
    <aside className="min-w-[300px] aspect-square flex flex-col p-5 h-full bg-neutral-100 rounded-2xl">
      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        <h4 className="text-secondary text-6xl font-bold">200</h4>
        <p className="text-black/40">待领取积分</p>
      </div>
      <Button className="w-full">{t("mining:header.receive")}</Button>
    </aside>
  );
};
