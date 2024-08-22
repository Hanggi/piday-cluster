"use client";

import Pagination from "@/src/components/piday-ui/pagination/Pagination";
import { useGetUsersQuery } from "@/src/features/admin/users/user-admin-api";
import { displayPiAddress } from "@/src/utils/pi-address";
import { format } from "date-fns";

import Card from "@mui/joy/Card";
import CircularProgress from "@mui/joy/CircularProgress";
import IconButton from "@mui/joy/IconButton";
import Table from "@mui/joy/Table";
import Tooltip from "@mui/joy/Tooltip";
import Typography from "@mui/joy/Typography";

import { useCallback, useState } from "react";

import UserBalanceRecordDrawer from "./UserBalanceRecordDrawer";

export default function UserList() {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);

  const [selectUserID, setSelectUserID] = useState<string | null>(null);
  const [openBalanceRecordDrawer, setOpenBalanceRecordDrawer] = useState(false);

  const { data: userRes, isLoading } = useGetUsersQuery({
    page,
    size,
  });

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
              <th>Username / Email</th>
              <th>Balance</th>
              <th>Pi Wallet Address</th>
              <th>Inviter ID</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {userRes?.users?.map((ve) => (
              <tr key={ve.id}>
                <td>
                  <Typography>{ve.id}</Typography>
                  <Typography>{ve.vid}</Typography>
                </td>
                <td>
                  <Typography>{ve.username}</Typography>
                  <Typography>{ve.email}</Typography>
                </td>
                <td>
                  <Typography> {ve.balance}</Typography>
                  <IconButton
                    onClick={() => {
                      setSelectUserID(ve.keycloakID as string);
                      setOpenBalanceRecordDrawer(true);
                    }}
                  >
                    <i className="ri-search-line"></i>
                  </IconButton>
                </td>
                <td>
                  <Tooltip title={ve.piWalletAddress}>
                    <Typography>
                      {displayPiAddress(ve.piWalletAddress)}
                    </Typography>
                  </Tooltip>
                </td>
                <td>
                  <Typography>{ve.inviterID}</Typography>
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
            pageCount={(userRes?.totalCount || 0) / size}
            onPageChange={handlePageClick}
          />
        </div>
      </Card>

      <UserBalanceRecordDrawer
        userID={selectUserID as string}
        open={openBalanceRecordDrawer}
        onClose={() => {
          setOpenBalanceRecordDrawer(false);
          setSelectUserID(null);
        }}
      />
    </div>
  );
}
