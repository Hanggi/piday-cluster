"use client";

import { useGetGeneralLedgerQuery } from "@/src/features/admin/users/user-admin-api";
import { useGetWithdrawRequestsQuery } from "@/src/features/admin/withdraw-requests/withdraw-requests-api";

import Card from "@mui/joy/Card";
import CircularProgress from "@mui/joy/CircularProgress";
import Typography from "@mui/joy/Typography";

export default function GeneralLedger() {
  const { data: generalLedger, isLoading } = useGetGeneralLedgerQuery();

  const { data: withdrawRequest } = useGetWithdrawRequestsQuery({
    page: 1,
    size: 10,
  });
  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <Typography level="title-lg">Total Balance</Typography>
          <Typography level="h2">
            {generalLedger?.generalBalance}
            {isLoading && <CircularProgress />}
          </Typography>
        </Card>

        <Card>
          <Typography level="title-lg">Total Users</Typography>
          <Typography level="h2">
            {generalLedger?.totalUsers}
            {isLoading && <CircularProgress />}
          </Typography>
        </Card>

        <Card>
          <Typography level="title-lg">Total Virtual Estates</Typography>
          <Typography level="h2">
            {generalLedger?.totalVirtualEstates}
            {isLoading && <CircularProgress />}
          </Typography>
        </Card>

        <Card>
          <Typography level="title-lg">Total Transactions</Typography>
          <Typography level="h2">
            {generalLedger?.totalTransactions}
            {isLoading && <CircularProgress />}
          </Typography>
        </Card>

        <Card>
          <Typography level="title-lg">Total Transaction Amount</Typography>
          <Typography level="h2">
            {generalLedger?.totalTransactionAmount}
            {isLoading && <CircularProgress />}
          </Typography>
        </Card>

        <Card>
          <Typography level="title-lg">Invite Code</Typography>
          <Typography level="h2">
            {generalLedger?.inviteCode}
            {isLoading && <CircularProgress />}
          </Typography>
        </Card>
      </div>
    </div>
  );
}
