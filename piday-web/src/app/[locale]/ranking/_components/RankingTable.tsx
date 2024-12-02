import { PaginationDeprecated } from "@/src/components/Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/Table";
import { cn } from "@/src/utils/cn";

import Card from "@mui/joy/Card";

import Image from "next/image";

import { ComponentProps, useMemo, useState } from "react";

import { RankDataKey } from "../@types/rankData.type";
import { rankData } from "./rankData";
import { CommissionRankingTable } from "./tables/CommissionRankTable";
import { InvitationRankingTable } from "./tables/InvitationRankTable";
import { PointsRankTable } from "./tables/PointsRankTable";

type RankingTableProps = ComponentProps<typeof Table> & {
  dataKey: RankDataKey;
};

export function RankingTable({
  className,
  dataKey,
  ...props
}: RankingTableProps) {
  const [pageCount, setPageCount] = useState(0);
  console.log("Data Key", dataKey);
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

  switch (dataKey) {
    case "invitation":
      return <InvitationRankingTable dataKey={dataKey} />;

    case "commission":
      return <CommissionRankingTable dataKey={dataKey} />;
    case "points":
      return <PointsRankTable dataKey={dataKey} />;
    default:
      return (
        <Card>
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
              {cell.map((item: any, idx: number) => (
                <TableRow key={Object.keys(item)?.[0]}>
                  <TableCell className="flex items-center gap-2">
                    {renderIcon(idx)} {idx + 1}
                  </TableCell>
                  {Object.values(item).map((col: any) => (
                    <TableCell key={col}>{col}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <PaginationDeprecated />
        </Card>
      );
  }
}
