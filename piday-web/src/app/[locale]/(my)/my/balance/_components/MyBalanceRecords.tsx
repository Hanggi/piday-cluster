"use client";

import Pagination from "@/src/components/piday-ui/pagination/Pagination";
import { useGetMyRechargeRecordsQuery } from "@/src/features/account/api/accountAPI";
import { format } from "date-fns";

import Card from "@mui/joy/Card";
import Table from "@mui/joy/Table";
import Typography from "@mui/joy/Typography";

import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

export default function MyBalanceRecords() {
  const { t } = useTranslation(["asset-center"]);

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);

  const { data: balanceRecordsRes } = useGetMyRechargeRecordsQuery({
    page,
    size,
  });

  const handlePageClick = useCallback(({ selected }: { selected: number }) => {
    setPage(selected + 1);
  }, []);

  return (
    <div>
      <Card>
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>
                <Typography level="title-md">
                  {t("asset-center:table.amount")}
                </Typography>
              </th>
              <th>
                <Typography level="title-md">
                  {t("asset-center:table.createdAt")}
                </Typography>
              </th>
            </tr>
          </thead>
          <tbody>
            {balanceRecordsRes?.records?.map((record, i) => (
              <tr key={i}>
                <td>{(page - 1) * size + i + 1}</td>
                <td>
                  <Typography
                    className={
                      (record.amount > 0 ? "text-green-500" : "text-red-500") +
                      " font-bold"
                    }
                  >
                    {record.amount}
                  </Typography>
                </td>
                <td>{format(new Date(record?.createdAt), "PPpp")}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div>
          <Pagination
            currentPage={page}
            pageCount={(balanceRecordsRes?.totalCount || 0) / size}
            onPageChange={handlePageClick}
          />
        </div>
      </Card>
    </div>
  );
}
