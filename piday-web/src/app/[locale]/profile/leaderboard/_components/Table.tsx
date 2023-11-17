"use client";

import { cn } from "@/src/utils/cn";

import { Chip, Input, Typography } from "@mui/joy";

import { ElementRef, useRef } from "react";
import { useTranslation } from "react-i18next";

export const Table = () => {
  const { t } = useTranslation("profile");
  const inputRef = useRef<ElementRef<typeof Input>>(null);
  return (
    <section>
      <div className="flex items -center gap-4">
        <Typography level="h4">
          {t("profile:leaderboard.teamMemberStatistics")}
        </Typography>
        <Chip
          className="py-2 [&>span]:flex [&>span]:items-center [&>span]:gap-2 !rounded-md"
          color="success"
          size="lg"
          variant="soft"
        >
          <svg
            fill="none"
            height="6"
            viewBox="0 0 6 6"
            width="6"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="3" cy="3" fill="#00C187" r="3" />
          </svg>
          <Typography color="success" level="title-md">
            目前在线20人
          </Typography>
        </Chip>
      </div>
      <header className="flex gap-4 max-md:flex-wrap py-3">
        <Input
          placeholder={t("profile:leaderboard.enterMemberName")}
          ref={inputRef}
          size="lg"
        />
        <div
          className={cn(inputRef.current?.className, "flex gap-7 items-center")}
        >
          <input
            className="outline-none w-full bg-transparent"
            placeholder={t("profile:leaderboard.minInvitations")}
          />
          ~
          <input
            className="outline-none w-full bg-transparent"
            placeholder={t("profile:leaderboard.maxInvitations")}
          />
        </div>
        <div
          className={cn(inputRef.current?.className, "flex gap-7 items-center")}
        >
          <input
            className="outline-none w-full bg-transparent"
            placeholder={t("profile:leaderboard.minRanking")}
          />
          ~
          <input
            className="outline-none w-full bg-transparent"
            placeholder={t("profile:leaderboard.maxRanking")}
          />
        </div>
      </header>
    </section>
  );
};
