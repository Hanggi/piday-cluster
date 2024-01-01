"use client";

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

import Image from "next/image";

import { ComponentProps } from "react";
import { useTranslation } from "react-i18next";

type TableProps = ComponentProps<typeof WrapperCard>;

export function VirtualEstateTradingHisory({
  className,
  ...props
}: TableProps) {
  const { t } = useTranslation("map");
  
  return (
    <WrapperCard className={cn("w-full mb-6 container", className)} {...props}>
      <h4 className="text-xl font-semibold">{t("landHistory")}</h4>
      <TableRoot className="mt-5">
        <TableHeader>
          <TableRow>
            {[, "type", "price", "date", "user"].map((head) => (
              <TableHead key={head}>{t(`column.${head}`)}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from(Array(4).keys()).map((idx) => (
            <TableRow key={idx}>
              {data.map((el, idx) => (
                <TableCell key={el}>
                  {idx === 1 && (
                    <Image
                      alt="pid"
                      className="aspect-square inline-block object-contain w-5 mr-1"
                      height={24}
                      src={"/img/icons/pid.png"}
                      width={24}
                    />
                  )}
                  {el}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </TableRoot>
    </WrapperCard>
  );
}

const data = ["拍卖开始", "150", "2023-08-25 16:00:21", "0x4bb...0707"];
