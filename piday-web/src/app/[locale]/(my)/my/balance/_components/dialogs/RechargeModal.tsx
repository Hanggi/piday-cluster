import { useUpdateMyPiWalletAddressMutation } from "@/src/features/account/api/accountAPI";
import { useGetMyUserQuery } from "@/src/features/auth/api/authAPI";

import Button from "@mui/joy/Button";
import DialogContent from "@mui/joy/DialogContent";
import DialogTitle from "@mui/joy/DialogTitle";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import ModalDialog from "@mui/joy/ModalDialog";
import Typography from "@mui/joy/Typography";

import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

interface Props {
  open: boolean;
  rechargeAddress: string;
  onClose: () => void;
}

export default function RechargeModal({
  open,
  rechargeAddress,
  onClose,
}: Props) {
  const { t } = useTranslation(["asset-center"]);

  const { data: myUser, refetch: refetchMyUser } = useGetMyUserQuery();

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
    <Modal open={open} onClose={onClose}>
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
  );
}
