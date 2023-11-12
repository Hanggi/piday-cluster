import { Pagination } from "@/src/components/Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/Table";
import { cn } from "@/src/utils/cn";

import Image from "next/image";

import { ComponentProps, useMemo } from "react";

import { RankDataKey, rankData } from "./rankData";

type RankingTableProps = ComponentProps<typeof Table> & {
  dataKey: RankDataKey;
};

export function RankingTable({
  className,
  dataKey,
  ...props
}: RankingTableProps) {
  const [head, cell] = useMemo(() => {
    return [Object.keys(rankData[dataKey]?.[0]), rankData[dataKey]];
  }, [dataKey]);

  function renderIcon(idx: number) {
    if (idx > 2) return;
    const filter = ["gold", "silver", "bronze"];
    return (
      <Image
        alt={filter[idx]}
        height={20}
        src={`/img/icons/${filter[idx]}.svg`}
        width={20}
      />
    );
  }

  return (
    <>
      <Table className={cn(className)} {...props}>
        <TableHeader>
          <TableRow>
            <TableHead>ranks</TableHead>
            {head.map((item) => (
              <TableHead key={item}>{item}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {cell.map((item, idx) => (
            <TableRow key={Object.keys(item)?.[0]}>
              <TableCell className="flex items-center gap-2">
                {renderIcon(idx)} {idx + 1}
              </TableCell>
              {Object.values(item).map((col) => (
                <TableCell key={col}>{col}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination />
    </>
  );
}
