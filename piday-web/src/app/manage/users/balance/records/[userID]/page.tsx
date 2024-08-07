"use client";

import Pagination from "@/src/components/piday-ui/pagination/Pagination";
import { useGetRechargeRecordsByUserIdQuery } from "@/src/features/admin/users/user-admin-api";
import { format } from "date-fns";

import Card from "@mui/joy/Card";
import CircularProgress from "@mui/joy/CircularProgress";
import Table from "@mui/joy/Table";
import Typography from "@mui/joy/Typography";

import { useCallback, useState } from "react";

interface Props {
  params: { userID: string };
}

export default function RechargeRecords({ params: { userID } }: Props) {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const { data: balanceRec, isLoading } = useGetRechargeRecordsByUserIdQuery({
    userID,
    page,
    size,
  });

  console.log("Balance rec", balanceRec);
  const handlePageClick = useCallback(({ selected }: { selected: number }) => {
    setPage(selected + 1);
  }, []);

  return (
    <div className="p-8 pt-16 md:pt-8">
      <h1>User Recharge Records Page</h1>
      <div>
        <div className="mt-8">
          <Card>
            <Table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>tx ID</th>
                  <th>To</th>
                  <th>From</th>
                  <th>Reason</th>
                  <th>
                    <Typography level="title-md">Amount</Typography>
                  </th>

                  <th>
                    <Typography level="title-md">created At</Typography>
                  </th>
                </tr>
              </thead>
              <tbody>
                {balanceRec?.records?.map((record, i) => (
                  <tr key={i}>
                    <td>{(page - 1) * size + i + 1}</td>
                    <td>{record.externalID}</td>
                    <td>{record?.receiver?.username}</td>
                    <td>{record?.sender?.username}</td>
                    <td>{record?.reason}</td>
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
                    <td>{format(new Date(record?.createdAt), "PPpp")}</td>
                  </tr>
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
          </Card>
        </div>
      </div>
    </div>
  );
}
