"use client";

import Pagination from "@/src/components/piday-ui/pagination/Pagination";
import {
  useGetBalanceQuery,
  useGetMyRechargeRecordsQuery,
} from "@/src/features/account/api/accountAPI";
import { useGetWithdrawRequestsQuery } from "@/src/features/admin/withdraw-requests/withdraw-requests-api";
import { format } from "date-fns";

import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import Table from "@mui/joy/Table";
import Typography from "@mui/joy/Typography";

import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import RechargeModal from "./dialogs/RechargeModal";
import TransferBalanceModal from "./dialogs/TransferBalanceModal";
import WithdrawRequestModal from "./dialogs/WithdrawBalanceModal";

interface Props {
  rechargeAddress: string;
}

export default function MyBalanceRecords({ rechargeAddress }: Props) {
  const { t } = useTranslation(["asset-center"]);

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);

  const { refetch: refetchBalance } = useGetBalanceQuery({});
  const { data: balanceRecordsRes, refetch: refetchBalanceRecords } =
    useGetMyRechargeRecordsQuery({
      page,
      size,
    });

  const handlePageClick = useCallback(({ selected }: { selected: number }) => {
    setPage(selected + 1);
  }, []);

  const [openRecharge, setOpenRecharge] = useState(false);
  const [openTransferBalance, setOpenTransferBalance] = useState(false);

  const [openWithdraw, setOpenWithdraw] = useState(false);
  return (
    <div>
      <div className="mb-4 flex justify-between">
        <Button
          onClick={() => {
            setOpenTransferBalance(true);
          }}
        >
          <Typography className="z-10 !text-white">转账</Typography>
        </Button>
        <Button
          onClick={() => {
            setOpenWithdraw(true);
          }}
        >
          <Typography className="z-10 !text-white">提款</Typography>
        </Button>
        <Button
          onClick={() => {
            setOpenRecharge(true);
          }}
        >
          <Typography className="z-10 !text-white">
            {t("asset-center:title.recharge")}
          </Typography>
        </Button>
      </div>

      <Card>
        <Table hoverRow noWrap stripe="even">
          <thead>
            <tr>
              <th>ID</th>
              <th>tx ID</th>
              <th>To</th>
              <th>From</th>
              <th>Reason</th>
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
                <td>{record.externalID}</td>
                <td>{record?.receiver?.username}</td>
                <td>{record?.sender?.username}</td>
                <td>{t(`profile:balance.${record?.reason}`)}</td>
                <td>
                  <Typography
                    className={
                      (record?.amount > 0 ? "text-green-500" : "text-red-500") +
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

      <RechargeModal
        open={openRecharge}
        rechargeAddress={rechargeAddress}
        onClose={() => {
          setOpenRecharge(false);
        }}
      />

      <TransferBalanceModal
        open={openTransferBalance}
        onClose={() => {
          setOpenTransferBalance(false);
        }}
        onSuccess={() => {
          refetchBalanceRecords();
        }}
      />
      <WithdrawRequestModal
        open={openWithdraw}
        onClose={() => {
          setOpenWithdraw(false);
        }}
        onSuccess={() => {
          refetchBalanceRecords();
          refetchBalance();
        }}
      />
    </div>
  );
}
