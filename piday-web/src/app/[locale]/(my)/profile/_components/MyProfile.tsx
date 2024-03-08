"use client";

import { useUpdateMyPiWalletAddressMutation } from "@/src/features/account/api/accountAPI";
import { useGetMyUserQuery } from "@/src/features/auth/api/authAPI";
import { useGetInviteCodeQuery } from "@/src/features/user/api/userAPI";
import { useSession } from "next-auth/react";

import { Button, Input } from "@mui/joy";
import Typography from "@mui/joy/Typography";

import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

export default function MyProfile() {
  const { t } = useTranslation("profile");

  const { data: session } = useSession();
  const { data: myUser, refetch: refetchMyUser } = useGetMyUserQuery();

  const [piWalletAddress, setPiWalletAddress] = useState("");
  const [updateWalletAddress, UpdatePiWalletAddressResult] =
    useUpdateMyPiWalletAddressMutation();

  const { data: invitationCode } = useGetInviteCodeQuery();

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
        <Typography level="title-md">Pi Wallet Address</Typography>
        {myUser?.piWalletAddress ? (
          <Typography>{myUser?.piWalletAddress}</Typography>
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
    </div>
  );
}

function formatID(id?: string) {
  if (!id) {
    return "";
  }
  return id.toString().padStart(8, "0");
}
