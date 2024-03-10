"use client";

import Pagination from "@/src/components/piday-ui/pagination/Pagination";
import { RechargeRecordInterface } from "@/src/features/account/interface/recharge-record.interface";
import { useGetLedgerRecordsQuery } from "@/src/features/admin/users/user-admin-api";
import { format } from "date-fns";

import Card from "@mui/joy/Card";
import CircularProgress from "@mui/joy/CircularProgress";
import Table from "@mui/joy/Table";

import { useState } from "react";

export default function LedgerRecords() {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);

  const { data: ledgerRecords, isLoading } = useGetLedgerRecordsQuery({
    page,
    size,
  });

  return (
    <div>
      <Card>
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Amount</th>
              <th>Reason</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {ledgerRecords?.records.map(
              (record: RechargeRecordInterface, index) => (
                <tr key={index}>
                  <td>{record.id}</td>
                  <td>{record.amount}</td>
                  <td>{record.reason}</td>
                  <td>{format(new Date(record?.createdAt), "PPpp")}</td>
                </tr>
              ),
            )}
          </tbody>
        </Table>

        <div className="flex justify-center">
          {isLoading && <CircularProgress />}
        </div>
        <Pagination
          currentPage={page}
          pageCount={ledgerRecords?.totalCount || 0 / 20}
        />
      </Card>
    </div>
  );
}
