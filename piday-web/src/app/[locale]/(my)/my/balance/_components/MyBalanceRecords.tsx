"use client";

import Pagination from "@/src/components/piday-ui/pagination/Pagination";
import {
  useGetMyRechargeRecordsQuery,
  useUpdateMyPiWalletAddressMutation,
} from "@/src/features/account/api/accountAPI";
import { useGetMyUserQuery } from "@/src/features/auth/api/authAPI";
import { format } from "date-fns";

import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import DialogContent from "@mui/joy/DialogContent";
import DialogTitle from "@mui/joy/DialogTitle";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import ModalDialog from "@mui/joy/ModalDialog";
import Table from "@mui/joy/Table";
import Typography from "@mui/joy/Typography";

import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

interface Props {
  rechargeAddress: string;
}

export default function MyBalanceRecords({ rechargeAddress }: Props) {
  const { t } = useTranslation(["asset-center"]);

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);

  const { data: balanceRecordsRes } = useGetMyRechargeRecordsQuery({
    page,
    size,
  });

  const handlePageClick = useCallback(({ selected }: { selected: number }) => {
    setPage(selected + 1);
  }, []);

  const { data: myUser, refetch: refetchMyUser } = useGetMyUserQuery();
  const [open, setOpen] = useState(false);

  const [updateWalletAddress, UpdatePiWalletAddressResult] =
    useUpdateMyPiWalletAddressMutation();

  const [piWalletAddress, setPiWalletAddress] = useState("");
  const handlePiWalletAddressChange = useCallback((e: any) => {
    setPiWalletAddress(e.target.value.trim());
  }, []);

  useEffect(() => {
    if (UpdatePiWalletAddressResult.isSuccess) {
      toast.success(t("profile:toast.updatePiWalletAddressSuccess"));
      refetchMyUser();
    }
  }, [UpdatePiWalletAddressResult.isSuccess, refetchMyUser, t]);

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button
          onClick={() => {
            setOpen(true);
          }}
        >
          <Typography className="z-10 !text-white">
            {t("asset-center:title.recharge")}
          </Typography>
        </Button>
      </div>

      <Card>
        <Table>
          <thead>
            <tr>
              <th>ID</th>
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
                <td>
                  <Typography
                    className={
                      (record.amount > 0 ? "text-green-500" : "text-red-500") +
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

      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <ModalDialog>
          <ModalClose />
          <DialogTitle>{t("asset-center:title.recharge")}</DialogTitle>
          <DialogContent>
            <div className="mb-4">
              <Typography>{t("asset-center:hint.howToRecharge")}</Typography>
            </div>

            <div className="mb-4">
              <Typography>{t("asset-center:label.rechargeAddress")}</Typography>
              <Typography color="success">{rechargeAddress}</Typography>
            </div>

            <div className="mb-4">
              <Typography>{t("asset-center:label.myAddress")}</Typography>
              <Typography></Typography>
              {myUser?.piWalletAddress ? (
                <Typography level="body-xs">
                  {myUser?.piWalletAddress.slice(0, 6)}...
                  {myUser?.piWalletAddress.slice(-6)}
                </Typography>
              ) : (
                <div className="flex gap-4">
                  <Input
                    placeholder={t(
                      "profile:profile.placeholder.enterYourPiWalletAddress",
                    )}
                    value={piWalletAddress}
                    onChange={handlePiWalletAddressChange}
                  />
                  <Button
                    disabled={UpdatePiWalletAddressResult.isLoading}
                    onClick={() => {
                      updateWalletAddress({ piWalletAddress });
                    }}
                  >
                    {t("profile:button.save")}
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </ModalDialog>
      </Modal>
    </div>
  );
}
