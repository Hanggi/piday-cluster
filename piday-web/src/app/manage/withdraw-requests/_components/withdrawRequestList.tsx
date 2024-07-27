"use client";

import Pagination from "@/src/components/piday-ui/pagination/Pagination";
import {
  useAcceptWithdrawRequestMutation,
  useCancelWithdrawRequestMutation,
  useGetWithdrawRequestsQuery,
} from "@/src/features/admin/withdraw-requests/withdraw-requests-api";
import { format } from "date-fns";

import { Button } from "@mui/joy";
import Card from "@mui/joy/Card";
import CircularProgress from "@mui/joy/CircularProgress";
import Table from "@mui/joy/Table";
import Typography from "@mui/joy/Typography";

import { useCallback, useState } from "react";
import { toast } from "react-toastify";

export default function WithdrawRequestList() {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);

  const {
    data: withdrawRequest,
    isLoading,
    refetch,
  } = useGetWithdrawRequestsQuery({
    page,
    size,
  });

  const [acceptWithdrawRequest, acceptWithdrawRequestResult] =
    useAcceptWithdrawRequestMutation();

  const [cancelWithdrawRequest, cancelWithdrawRequestResult] =
    useCancelWithdrawRequestMutation();

  const handleAcceptWithdrawRequest = useCallback(
    async (withdrawStatusID: string) => {
      const r = await acceptWithdrawRequest({ withdrawStatusID }).unwrap();
      console.log("HEYY R", r);
      if (r.success) {
        refetch();
        toast.success("Accepted the withdraw request");
      } else {
        toast.error("Something happened please try again");
      }
    },
    [],
  );
  const handleCancelWithdrawRequest = useCallback(
    async (withdrawStatusID: string) => {
      const r = await cancelWithdrawRequest({ withdrawStatusID }).unwrap();
      if (r.success) {
        refetch();
        toast.success("Canceled the withdraw request");
      } else {
        toast.error("Something happened please try again");
      }
    },
    [],
  );

  const handlePageClick = useCallback(({ selected }: { selected: number }) => {
    setPage(selected + 1);
  }, []);

  return (
    <div className="mt-8">
      <Card>
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Amount</th>
              <th>Owner</th>
              <th>Created At</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {withdrawRequest?.withdrawRequests?.map((wr) => (
              <tr key={wr.id}>
                <td>{wr.id}</td>
                <td>{wr.amount}</td>
                <td>
                  <Typography>{wr.owner.username}</Typography>
                  <Typography>{wr.owner.email}</Typography>
                </td>
                <td>{format(new Date(wr.createdAt), "yyyy-MM-dd hh:MM:ss")}</td>
                <td>{wr.status}</td>
                <td>
                  {wr.status === "PENDING" && (
                    <>
                      {" "}
                      <Button
                        onClick={() =>
                          handleAcceptWithdrawRequest(wr.withdrawStatusID)
                        }
                      >
                        Accept
                      </Button>
                      ||
                      <Button
                        onClick={() =>
                          handleCancelWithdrawRequest(wr.withdrawStatusID)
                        }
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                </td>
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
            pageCount={(withdrawRequest?.totalCount || 0) / size}
            onPageChange={handlePageClick}
          />
        </div>
      </Card>
    </div>
  );
}
