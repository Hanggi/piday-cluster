"use client";

import PiCoinLogo from "@/src/components/piday-ui/PiCoinLogo";
import ConfirmDialog from "@/src/components/piday-ui/confirm-dialog/ConfirmDialog";
import {
  useErrorToast,
  useSuccessToast,
} from "@/src/features/rtk-utils/use-error-toast.hook";
import { myUserValue } from "@/src/features/user/user-slice";
import { VirtualEstateListing } from "@/src/features/virtual-estate-listing/interface/virtual-estate-listing.interface";
import { useAcceptBidToSellVirtualEstateMutation } from "@/src/features/virtual-estate/api/virtualEstateAPI";

import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";

import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

interface Props {
  open: boolean;
  hexID: string;
  placeName: string;
  listing: VirtualEstateListing;
  onClose: () => void;
  onConfirm: () => void;
}

export default function AcceptBidToSellDialog({
  open,
  onClose,
  hexID,
  placeName,
  listing,
  onConfirm,
}: Props) {
  const { t } = useTranslation(["virtual-estate"]);

  const myUser = useSelector(myUserValue);
  useEffect(() => {
    if (myUser && !myUser.isPaymentPasswordSet) {
      toast.warn("请先设置支付密码!4");
    }
  }, [myUser]);
  const [paymentPassword, setPaymentPassword] = useState("");

  const [acceptBidToSellVirtualEstate, acceptBidToSellVirtualEstateResult] =
    useAcceptBidToSellVirtualEstateMutation();
  useErrorToast(acceptBidToSellVirtualEstateResult.error);
  useSuccessToast(
    acceptBidToSellVirtualEstateResult.isSuccess,
    t("virtual-estate:toast.acceptBidSuccessfully"),
    () => {
      onConfirm();
    },
  );

  const handelAcceptBidToSellVirtualEstate = useCallback(() => {
    acceptBidToSellVirtualEstate({
      hexID,
      bidID: listing?.listingID,
      paymentPassword,
    });
    onClose();
  }, [
    acceptBidToSellVirtualEstate,
    hexID,
    listing?.listingID,
    onClose,
    paymentPassword,
  ]);

  return (
    <div>
      <ConfirmDialog
        open={open}
        title={t("virtual-estate:title.confirmMintVirtualEstate")}
        onCancel={() => {
          onClose();
        }}
        onConfirm={handelAcceptBidToSellVirtualEstate}
      >
        <div className="mt-4">
          <div className="flex mb-2">
            <Typography className="w-1/3" level="title-md">
              {t("virtual-estate:label.name")}:
            </Typography>
            <Typography className="w-2/3">{placeName}</Typography>
          </div>
          <div className="flex mb-2">
            <Typography className="w-1/3" level="title-md">
              {t("virtual-estate:label.price")}:
            </Typography>
            <div className="flex gap-2">
              <div className="w-6 h-6 relative">
                <PiCoinLogo />
              </div>
              <Typography className="w-2/3">{listing?.price}</Typography>
            </div>
          </div>
          <div className="flex mb-2">
            <Typography className="w-1/3" level="title-md">
              {t("virtual-estate:label.hashValue")}:
            </Typography>
            <Typography className="w-2/3">{hexID}</Typography>
          </div>
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
      </ConfirmDialog>
    </div>
  );
}
