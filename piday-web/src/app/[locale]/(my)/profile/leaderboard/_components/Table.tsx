"use client";

import { PaginationDeprecated } from "@/src/components/Pagination";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  Table as TableRoot,
  TableRow,
} from "@/src/components/Table";
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
      <TableRoot className="mt-5">
        <TableHeader>
          <TableRow>
            {[
              "memberName",
              "currentStatus",
              "numberOfPeopleInvited",
              "globalRanking",
            ].map((head) => (
              <TableHead key={head}>
                {t(`profile:leaderboard.table.${head}`)}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from(Array(10).keys()).map((idx) => (
            <TableRow key={idx}>
              {data.map((el) => (
                <TableCell key={el}>{el}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </TableRoot>
      <PaginationDeprecated className="mb-2" />
    </section>
  );
};

const data = ["张飞", "在线", "5", "24"];
