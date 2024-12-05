"use client";

import ConfirmDialog from "@/src/components/piday-ui/confirm-dialog/ConfirmDialog";
import {
  useErrorToast,
  useSuccessToast,
} from "@/src/features/rtk-utils/use-error-toast.hook";
import { useLazyGetUserInfoQuery } from "@/src/features/user/api/userAPI";
import { myUserValue } from "@/src/features/user/user-slice";
import { useTransferVirtualEstateToUserMutation } from "@/src/features/virtual-estate/api/virtualEstateAPI";
import { debounce } from "lodash";

import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";

import { useRouter } from "next/navigation";

import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

interface Props {
  open: boolean;
  hexID: string;
  onClose: () => void;
}

export default function TransferVirtualEstateDialog({
  open,
  hexID,
  onClose,
}: Props) {
  const { t } = useTranslation(["virtual-estate"]);
  const router = useRouter();

  const myUser = useSelector(myUserValue);
  useEffect(() => {
    if (open && myUser && !myUser.isPaymentPasswordSet) {
      toast.warn("请先设置支付密码!6");
    }
  }, [myUser, open]);

  const [userInput, setUserInput] = useState(""); // email, userID, piAddress

  // TODO: Remove this
  const [getUserInfoTrigger, { data: userInfo, isLoading: userInfoIsLoading }] =
    useLazyGetUserInfoQuery();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const piWalletRegex = /^[A-Z0-9]{56}$/; // 假设格式

      if (uuidRegex.test(value.trim())) {
        getUserInfoTrigger({ userID: value });
        return "UUID";
      } else if (emailRegex.test(value.trim())) {
        getUserInfoTrigger({ email: value });
        return "Email";
      } else if (piWalletRegex.test(value.trim())) {
        getUserInfoTrigger({ walletAddress: value });
        return "PI Wallet Address";
      } else {
        return "Unknown Format";
      }
    }, 500),
    [],
  );

  const [paymentPassword, setPaymentPassword] = useState("");

  const [trnasferVirtualEstateToUser, trnasferVirtualEstateToUserResponse] =
    useTransferVirtualEstateToUserMutation();
  useSuccessToast(
    trnasferVirtualEstateToUserResponse.isSuccess,
    "Transfer successfully",
    () => {
      router.refresh();
    },
  );
  useErrorToast(trnasferVirtualEstateToUserResponse.error);

  const handleInputChange = useCallback(
    (value: string) => {
      setUserInput(value);

      debouncedSearch(value);
    },
    [debouncedSearch],
  );

  return (
    <div>
      <ConfirmDialog
        confirmDisabled={userInfoIsLoading || !userInfo}
        open={open}
        title={t("virtual-estate:button.transfer")}
        onCancel={() => {
          onClose();
        }}
        onConfirm={() => {
          if (!userInfo) {
            toast.warn(t("virtual-estate:toast.userNotFound"));
            return;
          }

          trnasferVirtualEstateToUser({
            hexID,
            receiverID: userInfo?.id,
            paymentPassword,
          });
          onClose();
        }}
      >
        <div className="mt-4">
          <div className="mb-2">
            <FormControl>
              <FormLabel>
                {t("virtual-estate:label.transferVirtualEstate")}:
              </FormLabel>
              <Input
                placeholder={t(
                  "virtual-estate:placeholder.transferVirtualEstatePlaceholder",
                )}
                value={userInput}
                onChange={(e) => {
                  handleInputChange(e.target.value);
                }}
              />
            </FormControl>

            {userInfo && (
              <div className="py-4">
                <Typography level="title-md">User: </Typography>
                <Typography>{userInfo?.username}</Typography>
              </div>
            )}

            {myUser?.isPaymentPasswordSet ? (
              <FormControl>
                <FormLabel>支付密码</FormLabel>
                <Input
                  placeholder="请输入支付密码"
                  type="password"
                  value={paymentPassword}
                  onChange={(e) => {
                    setPaymentPassword(e.target.value);
                  }}
                />
              </FormControl>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </ConfirmDialog>
    </div>
  );
}
