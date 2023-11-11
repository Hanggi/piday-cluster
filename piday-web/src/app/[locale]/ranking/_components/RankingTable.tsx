import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/Table";
import { cn } from "@/src/utils/cn";

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
  return (
    <Table className={cn(className)} {...props}>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          {head.map((item) => (
            <TableHead key={item}>{item}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {cell.map((item) => (
          <TableRow key={Object.keys(item)?.[0]}>
            <TableCell>INV001</TableCell>
            {Object.values(item).map((col) => (
              <TableCell key={col}>{col}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
