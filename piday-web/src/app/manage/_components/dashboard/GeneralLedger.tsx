"use client";

import { useGetGeneralLedgerQuery } from "@/src/features/admin/users/user-admin-api";

import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";

export default function GeneralLedger() {
  const { data: generalLedger } = useGetGeneralLedgerQuery();

  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <Typography level="title-lg">Total Balance</Typography>
          <Typography level="h2">
            {generalLedger?.generalBalance || 0}
          </Typography>
        </Card>

        <Card>
          <Typography level="title-lg">Total Users</Typography>
          <Typography level="h2">{generalLedger?.totalUsers || 0}</Typography>
        </Card>

        <Card>
          <Typography level="title-lg">Total Virtual Estates</Typography>
          <Typography level="h2">
            {generalLedger?.totalVirtualEstates || 0}
          </Typography>
        </Card>

        <Card>
          <Typography level="title-lg">Total Transactions</Typography>
          <Typography level="h2">
            {generalLedger?.totalTransactions || 0}
          </Typography>
        </Card>

        <Card>
          <Typography level="title-lg">Total Transaction Amount</Typography>
          <Typography level="h2">
            {generalLedger?.totalTransactionAmount || 0}
          </Typography>
        </Card>

        <Card>
          <Typography level="title-lg">Invite Code</Typography>
          <Typography level="h2">{generalLedger?.inviteCode || ""}</Typography>
        </Card>
      </div>
    </div>
  );
}
