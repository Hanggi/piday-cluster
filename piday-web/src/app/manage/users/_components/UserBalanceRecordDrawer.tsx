"use client";

import Pagination from "@/src/components/piday-ui/pagination/Pagination";
import { useGetRechargeRecordsByUserIdQuery } from "@/src/features/admin/users/user-admin-api";
import { format } from "date-fns";

import CircularProgress from "@mui/joy/CircularProgress";
import Drawer from "@mui/joy/Drawer";
import Table from "@mui/joy/Table";
import Typography from "@mui/joy/Typography";

import { useCallback, useState } from "react";
import React from "react";

interface Props {
  userID: string;

  open: boolean;
  onClose: () => void;
}

export default function UserBalanceRecordDrawer({
  userID,
  open,
  onClose,
}: Props) {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const { data: balanceRec, isLoading } = useGetRechargeRecordsByUserIdQuery({
    userID,
    page,
    size,
  });

  const handlePageClick = useCallback(({ selected }: { selected: number }) => {
    setPage(selected + 1);
  }, []);

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <div>
        <div className="p-2">
          <Typography level="h2">User Recharge Records Page</Typography>
          <div className="mt-8 ">
            <Table>
              <thead>
                <tr>
                  <th style={{ width: "15%" }}>ID</th>
                  <th>
                    <Typography>To {"=>"} From</Typography>
                    <Typography>Reason</Typography>
                  </th>

                  <th>
                    <Typography level="title-md">Amount</Typography>

                    <Typography level="title-md">created At</Typography>
                  </th>
                </tr>
              </thead>
              <tbody>
                {balanceRec?.records?.map((record, i) => (
                  <React.Fragment key={i}>
                    <tr key={i}>
                      <td rowSpan={2}>{(page - 1) * size + i + 1}</td>
                      <td>
                        <Typography>{record?.receiver?.username}</Typography>
                        {"=>"}
                        <Typography>{record?.sender?.username}</Typography>
                      </td>
                      <td>
                        <Typography
                          className={
                            (record?.amount > 0
                              ? "text-green-500"
                              : "text-red-500") + " font-bold"
                          }
                        >
                          {record.amount}
                        </Typography>
                      </td>
                    </tr>
                    <tr>
                      <td>{record?.reason}</td>
                      <td>{format(new Date(record?.createdAt), "PPpp")}</td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </Table>
            {isLoading && (
              <div className="flex justify-center my-4">
                <CircularProgress />
              </div>
            )}

            <div className="my-4">
              <Pagination
                currentPage={page}
                pageCount={Math.ceil((balanceRec?.totalCount || 0) / size)}
                onPageChange={handlePageClick}
              />
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
