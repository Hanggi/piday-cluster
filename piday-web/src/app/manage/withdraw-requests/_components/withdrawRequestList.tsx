"use client";

import Pagination from "@/src/components/piday-ui/pagination/Pagination";
import {
  useAcceptWithdrawRequestMutation,
  useCancelWithdrawRequestMutation,
  useGetWithdrawRequestsQuery,
} from "@/src/features/admin/withdraw-requests/withdraw-requests-api";
import {
  useErrorToast,
  useSuccessToast,
} from "@/src/features/rtk-utils/use-error-toast.hook";
import { format } from "date-fns";

import Alert from "@mui/joy/Alert";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import CircularProgress from "@mui/joy/CircularProgress";
import IconButton from "@mui/joy/IconButton";
import Table from "@mui/joy/Table";
import Typography from "@mui/joy/Typography";

import { useCallback, useState } from "react";
import React from "react";

import UserBalanceRecordDrawer from "../../users/_components/UserBalanceRecordDrawer";

export default function WithdrawRequestList() {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);

  const [selectUserID, setSelectUserID] = useState<string | null>(null);
  const [openBalanceRecordDrawer, setOpenBalanceRecordDrawer] = useState(false);

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
  useErrorToast(acceptWithdrawRequestResult.error);
  useSuccessToast(
    acceptWithdrawRequestResult.isSuccess,
    "Accept withdraw request success",
    () => {
      refetch();
    },
  );

  const [cancelWithdrawRequest, cancelWithdrawRequestResult] =
    useCancelWithdrawRequestMutation();
  useErrorToast(cancelWithdrawRequestResult.error);
  useSuccessToast(
    cancelWithdrawRequestResult.isSuccess,
    "Reject withdraw request success",
    () => {
      refetch();
    },
  );

  const handleAcceptWithdrawRequest = useCallback(
    async (withdrawStatusID: string) => {
      const r = await acceptWithdrawRequest({ withdrawStatusID }).unwrap();
    },
    [acceptWithdrawRequest],
  );
  const handleCancelWithdrawRequest = useCallback(
    async (withdrawStatusID: string) => {
      const r = await cancelWithdrawRequest({ withdrawStatusID }).unwrap();
    },
    [cancelWithdrawRequest],
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
              <th style={{ width: "6%" }}>ID</th>
              <th>Owner</th>
              <th
                style={{
                  textAlign: "right",
                }}
              >
                Created At
              </th>
              <th
                style={{
                  textAlign: "right",
                }}
              >
                Amount
              </th>
              <th
                style={{
                  textAlign: "right",
                }}
              >
                Status
              </th>
              <th
                style={{
                  textAlign: "right",
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {withdrawRequest?.withdrawRequests?.map((wr) => (
              <React.Fragment key={wr.id}>
                <tr>
                  <td rowSpan={2}>{wr.id}</td>
                  <td>
                    <Typography>{wr.owner.username}</Typography>
                    <Typography>{wr.owner.email}</Typography>
                  </td>
                  <td className="text-end">
                    <Typography>
                      {format(new Date(wr.createdAt), "yyyy-MM-dd hh:MM:ss")}
                    </Typography>
                  </td>
                  <td className="text-end">
                    <div className="flex justify-end items-center">
                      <Typography level="title-md">{wr.amount}</Typography>
                      <IconButton
                        onClick={() => {
                          setSelectUserID(wr.owner.keycloakID as string);
                          setOpenBalanceRecordDrawer(true);
                        }}
                      >
                        <i className="ri-search-line"></i>
                      </IconButton>
                    </div>
                  </td>
                  <td className="text-end">
                    <Typography
                      color={
                        wr.status === "CANCELED"
                          ? "danger"
                          : wr.status === "ACCEPTED"
                            ? "success"
                            : "neutral"
                      }
                      level="title-md"
                    >
                      {wr.status}
                    </Typography>
                  </td>
                  <td className="text-end">
                    {wr.status === "PENDING" && (
                      <div className="flex justify-end gap-4">
                        <Button
                          color="success"
                          onClick={() =>
                            handleAcceptWithdrawRequest(wr.withdrawStatusID)
                          }
                        >
                          Accept
                        </Button>

                        <Button
                          color="danger"
                          onClick={() =>
                            handleCancelWithdrawRequest(wr.withdrawStatusID)
                          }
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="text-end" colSpan={5}>
                    <div className="flex gap-2 items-center">
                      <Typography level="body-sm">
                        Pi Wallet Address:
                      </Typography>
                      <Alert size="sm" variant="outlined">
                        {wr.owner.piWalletAddress}
                      </Alert>
                    </div>
                  </td>
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
            pageCount={(withdrawRequest?.totalCount || 0) / size}
            onPageChange={handlePageClick}
          />
        </div>
      </Card>

      <UserBalanceRecordDrawer
        open={openBalanceRecordDrawer}
        userID={selectUserID as string}
        onClose={() => {
          setOpenBalanceRecordDrawer(false);
          setSelectUserID(null);
        }}
      />
    </div>
  );
}
