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
import { WrapperCard } from "@/src/components/WrapperCard";
import { cn } from "@/src/utils/cn";

import { ComponentProps } from "react";
import { useTranslation } from "react-i18next";

type TableProps = ComponentProps<typeof WrapperCard>;

export function Table({ className, ...props }: TableProps) {
  const { t } = useTranslation("mining");
  return (
    <WrapperCard className={cn("w-full", className)} {...props}>
      <h4 className="text-xl font-semibold">{t("mining:table.title")}</h4>
      <TableRoot className="mt-5">
        <TableHeader>
          <TableRow>
            {[
              "memberName",
              "pointAmount",
              "landOwnership",
              "numberOfPeopleInvited",
              "isActiveToday",
            ].map((head) => (
              <TableHead key={head}>{t(`mining:table.${head}`)}</TableHead>
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
    </WrapperCard>
  );
}

const data = ["张飞", "2400", "24", "5", "活跃"];
