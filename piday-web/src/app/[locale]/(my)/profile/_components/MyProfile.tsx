"use client";

import { useUpdateMyPiWalletAddressMutation } from "@/src/features/account/api/accountAPI";
import { useGetMyUserQuery } from "@/src/features/auth/api/authAPI";
import { useGetInviteCodeQuery } from "@/src/features/user/api/userAPI";
import { useSession } from "next-auth/react";

import Alert from "@mui/joy/Alert";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import Divider from "@mui/joy/Divider";
import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";

import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import SetPaymentPasswordModel from "./modals/SetPaymentPasswordModel";

export default function MyProfile() {
  const { t } = useTranslation("profile");

  const { data: session } = useSession();
  const {
    data: myUser,
    isLoading: isLoadingMyUser,
    refetch: refetchMyUser,
  } = useGetMyUserQuery();

  const [piWalletAddress, setPiWalletAddress] = useState("");
  const [editWalletAddress, setEditWalletAddress] = useState(false);
  const [updateWalletAddress, UpdatePiWalletAddressResult] =
    useUpdateMyPiWalletAddressMutation();

  const { data: invitationCode } = useGetInviteCodeQuery();

  const handlePiWalletAddressChange = useCallback((e: any) => {
    setPiWalletAddress(e.target.value.trim());
  }, []);

  useEffect(() => {
    if (UpdatePiWalletAddressResult.isSuccess) {
      toast.success(t("profile:toast.updatePiWalletAddressSuccess"));
      UpdatePiWalletAddressResult.reset();
      refetchMyUser();
      setEditWalletAddress(false);
    }
  }, [
    UpdatePiWalletAddressResult,
    UpdatePiWalletAddressResult.isSuccess,
    refetchMyUser,
    t,
  ]);

  // Payment password
  const [openPaymentPasswordModal, setOpenPaymentPasswordModal] =
    useState(false);

  return (
    <Card className="mt-8" size="lg">
      <div className="overflow-hidden">
        <div className="mb-4">
          <Typography level="title-lg">
            {t("profile:profile.myProfile")}
          </Typography>
        </div>
        <div className="mb-4">
          <Typography level="title-md">ID</Typography>
          <Typography>{formatID(myUser?.id)}</Typography>
        </div>
        <div className="mb-4">
          <Typography level="title-md">{t("profile:profile.email")}</Typography>
          <Typography>{session?.user?.email}</Typography>
        </div>
        <div className="mb-4">
          <Typography level="title-md">
            {t("profile:profile.invitationCodeLink")}
          </Typography>
          <Typography> https://piday.world/?ic={invitationCode}</Typography>
        </div>
        <div className="mb-4">
          <Typography level="title-md">
            {t("profile:profile.username")}
          </Typography>
          <Typography>{session?.user?.name}</Typography>
        </div>
        <div className="mb-4">
          <Typography level="title-md">
            My Pi Wallet Address（我的派钱包地址）
          </Typography>

          {myUser?.piWalletAddress && !editWalletAddress && (
            <div className="flex gap-4 items-center flex-wrap">
              <Typography>{myUser?.piWalletAddress}</Typography>
              {/* Pi Wallet Address updated 1 month ago */}
              {(!myUser.piWalletAddressUpdatedAt ||
                +new Date(myUser.piWalletAddressUpdatedAt) +
                  1000 * 60 * 60 * 24 * 30 <
                  +new Date()) && (
                <div>
                  <Button
                    onClick={() => {
                      setEditWalletAddress(true);
                    }}
                  >
                    编辑
                  </Button>
                </div>
              )}
            </div>
          )}

          {(editWalletAddress || !myUser?.piWalletAddress) && (
            <div className="flex gap-4">
              <Input
                error={
                  piWalletAddress.length > 0 &&
                  !isValidPiAddress(piWalletAddress)
                }
                placeholder={t(
                  "profile:profile.placeholder.enterYourPiWalletAddress",
                )}
                value={piWalletAddress}
                onChange={handlePiWalletAddressChange}
              />
              <Button
                disabled={UpdatePiWalletAddressResult.isLoading}
                loading={
                  isLoadingMyUser || UpdatePiWalletAddressResult.isLoading
                }
                onClick={() => {
                  if (!isValidPiAddress(piWalletAddress)) {
                    toast.warn("Invalid Pi Wallet Address");
                    return;
                  }
                  updateWalletAddress({ piWalletAddress });
                }}
              >
                {t("profile:button.save")}
              </Button>
            </div>
          )}
        </div>

        <Divider />

        <div className="my-4">
          {myUser?.isPaymentPasswordSet ? (
            <div>
              <Alert color="success">
                <i className="ri-verified-badge-fill text-lg"></i>
                支付密码已设
              </Alert>
            </div>
          ) : (
            <div>
              <Button
                loading={isLoadingMyUser}
                onClick={() => {
                  setOpenPaymentPasswordModal(true);
                }}
              >
                设置支付密码
              </Button>

              <SetPaymentPasswordModel
                open={openPaymentPasswordModal}
                onClose={() => {
                  setOpenPaymentPasswordModal(false);
                }}
                onSuccess={() => {
                  refetchMyUser();
                }}
              />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

function formatID(id?: string) {
  if (!id) {
    return "";
  }
  return id.toString().padStart(8, "0");
}

function isValidPiAddress(address: string) {
  const regex = /^[A-Z0-9]{56}$/i;

  return regex.test(address);
}
