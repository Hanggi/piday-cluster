"use client";

import { WrapperCard } from "@/src/components/WrapperCard";
import Pagination from "@/src/components/piday-ui/pagination/Pagination";
import { useGetPointRecordsQuery } from "@/src/features/point/api/pointAPI";
import { PointRecord } from "@/src/features/point/interface/point.interface";
import { cn } from "@/src/utils/cn";

import { CircularProgress } from "@mui/joy";
import Table from "@mui/joy/Table";

import { ComponentProps, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

type TableProps = ComponentProps<typeof WrapperCard>;

export function MyPointRecords({ className, ...props }: TableProps) {
  const { t } = useTranslation("mining");

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);

  const { data: pointRecords, isLoading } = useGetPointRecordsQuery({
    page,
    size,
  });

  const handlePageClick = useCallback(({ selected }: { selected: number }) => {
    setPage(selected + 1);
  }, []);

  return (
    <WrapperCard className={cn("w-full", className)} {...props}>
      {/* <h4 className="text-xl font-semibold">{t("mining:table.title")}</h4> */}
      <Table className="mt-5">
        <thead>
          <tr>
            <th>ID</th>
            <th>积分</th>
            <th>类型</th>
            <th>创建时间</th>
          </tr>
        </thead>
        <tbody>
          {pointRecords?.pointRecords?.map((record: PointRecord, idx) => (
            <tr key={idx}>
              <td>{idx + 1}</td>
              <td>{record.amount}</td>
              <td>{reasonToString(record.reason)}</td>
              <td>{record.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      {isLoading && (
        <div className="flex justify-center">
          <CircularProgress />
        </div>
      )}
      <Pagination
        currentPage={page}
        pageCount={(pointRecords?.totalCount || 0) / 20}
        onPageChange={handlePageClick}
      />
    </WrapperCard>
  );
}

function reasonToString(reason: string) {
  switch (reason) {
    case "CHECK_IN":
      return "签到奖励";
    case "INVITATION_POINT":
      return "邀请奖励";
    case "VIRTUAL_ESTATE_POINT":
      return "土地奖励";
    case "GOLDEN_VIRTUAL_ESTATE_POINT":
      return "黄金土地奖励";
    case "ANTARCTIC_VIRTUAL_ESTATE_POINT":
    case "ANTARCTICA_VIRTUAL_ESTATE_POINT":
      return "南极土地奖励";
    default:
      return reason;
  }
}
