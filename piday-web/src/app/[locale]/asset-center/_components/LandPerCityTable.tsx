"use client";

import { Pagination } from "@/src/components/Pagination";
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

import { Option, Select } from "@mui/joy";

import { ComponentProps } from "react";
import { useTranslation } from "react-i18next";

type TableProps = ComponentProps<typeof WrapperCard>;

export function LandPerCityTable({ className, ...props }: TableProps) {
  const { t } = useTranslation("asset-center");
  return (
    <WrapperCard className={cn("w-full", className)} {...props}>
      <h4 className="text-xl font-semibold">{t("landOwnershipByCity")}</h4>
      <Select
        placeholder="全部城市"
        className="!bg-transparent !max-w-[200px] mt-5"
      >
        <Option value="one">One</Option>
        <Option value="two">Two</Option>
        <Option value="three">Three</Option>
      </Select>
      <TableRoot className="mt-5">
        <TableHeader>
          <TableRow>
            {["city", "quantity"].map((head) => (
              <TableHead key={head}>{t(`${head}`)}</TableHead>
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
      <Pagination className="mb-2" />
    </WrapperCard>
  );
}

const data = ["中国", "20"];
