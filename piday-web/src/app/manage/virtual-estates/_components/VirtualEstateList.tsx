"use client";

import Pagination from "@/src/components/piday-ui/pagination/Pagination";
import { useGetVirtualEstatesQuery } from "@/src/features/admin/vritual-estates/virtual-estates-admin-api";
import { format } from "date-fns";

import Card from "@mui/joy/Card";
import CircularProgress from "@mui/joy/CircularProgress";
import Table from "@mui/joy/Table";
import Typography from "@mui/joy/Typography";

import { useState } from "react";

export default function VritualEstateList() {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);

  const { data: virtualEstateRes, isLoading } = useGetVirtualEstatesQuery({
    page,
    size,
  });

  return (
    <div className="mt-8">
      <Card>
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Last Price</th>
              <th>Owner</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {virtualEstateRes?.virtualEstates?.map((ve) => (
              <tr key={ve.id}>
                <td>{ve.id}</td>
                <td>{ve.lastPrice}</td>
                <td>
                  <Typography>{ve.owner.username}</Typography>
                  <Typography>{ve.owner.email}</Typography>
                </td>
                <td>{format(new Date(ve.createdAt), "yyyy-MM-dd hh:MM:ss")}</td>
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
            pageCount={(virtualEstateRes?.totalCount || 0) / size}
          />
        </div>
      </Card>
    </div>
  );
}
