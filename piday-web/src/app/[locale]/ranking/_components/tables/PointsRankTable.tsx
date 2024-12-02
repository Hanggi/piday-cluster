import Card from "@mui/joy/Card";

import Image from "next/image";

import { ComponentProps, useCallback, useState } from "react";
import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../../../src/components/Table";
import Pagination from "../../../../../../src/components/piday-ui/pagination/Pagination";
import { useGetPointsRankQuery } from "../../../../../../src/features/leaderboard/api/leaderboardAPI";
import { cn } from "../../../../../../src/utils/cn";
import { RankDataKey } from "../../@types/rankData.type";

type RankingTableProps = ComponentProps<typeof Table> & {
  dataKey: RankDataKey;
};

export function PointsRankTable({
  className,
  dataKey,
  ...props
}: RankingTableProps) {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const { data: pointsRank } = useGetPointsRankQuery({ page, size });

  const head = ["User name", "Land Holdings", "Total Points"];

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

  const handlePageClick = useCallback(({ selected }: { selected: number }) => {
    setPage(selected + 1);
  }, []);
  return (
    <Card>
      <Table className={cn(className)} {...props}>
        <TableHeader>
          <TableRow>
            <TableHead>Ranks</TableHead>
            {head.map((item) => (
              <TableHead key={item}>{item}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {pointsRank?.points?.rankedUsers?.map((item: any, idx: number) => (
            <TableRow key={idx}>
              <TableCell className="flex items-center gap-2">
                {renderIcon(idx)} {idx + 1}
              </TableCell>
              <TableCell key={item.username}>{item.username}</TableCell>
              <TableCell key={item.numberOfLandHoldings}>
                {item.numberOfLandHoldings}
              </TableCell>
              <TableCell key={item.totalPoints}>{item.totalPoints}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination
        currentPage={page}
        pageCount={Math.ceil((pointsRank?.points?.totalCount || 0) / size)}
        onPageChange={handlePageClick}
      />
    </Card>
  );
}
