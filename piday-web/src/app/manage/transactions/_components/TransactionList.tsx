"use client";

import Pagination from "@/src/components/piday-ui/pagination/Pagination";
import { useGetTransactionsQuery } from "@/src/features/admin/transactions/transaction-admin-api";
import { format } from "date-fns";

import Card from "@mui/joy/Card";
import CircularProgress from "@mui/joy/CircularProgress";
import Table from "@mui/joy/Table";
import Typography from "@mui/joy/Typography";

import { useState } from "react";

export default function TransactionList() {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);

  const { data: transactionRes, isLoading } = useGetTransactionsQuery({
    page,
    size,
  });

  console.log("transactionRes", transactionRes);

  return (
    <div className="mt-8">
      <Card>
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Virtual Estate ID</th>
              <th>Price</th>
              <th>Buyer</th>
              <th>Seller</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {transactionRes?.transactions?.map((tx) => (
              <tr key={tx.id}>
                <td>{tx.transactionID}</td>
                <td>{tx.virtualEstateID}</td>
                <td>{tx.price}</td>
                <td>
                  <Typography>{tx.buyer.username}</Typography>
                  <Typography>{tx.buyer.email}</Typography>
                </td>
                <td>
                  <Typography>{tx.seller.username}</Typography>
                  <Typography>{tx.seller.email}</Typography>
                </td>
                <td>{format(new Date(tx.createdAt), "yyyy-MM-dd hh:MM:ss")}</td>
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
            pageCount={(transactionRes?.totalCount || 0) / size}
          />
        </div>
      </Card>
    </div>
  );
}
