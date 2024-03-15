"use client";

import ConfirmDialog from "@/src/components/piday-ui/confirm-dialog/ConfirmDialog";
import {
  useErrorToast,
  useSuccessToast,
} from "@/src/features/rtk-utils/use-error-toast.hook";
import { myUserValue } from "@/src/features/user/user-slice";
import { useMintOneVirtualEstateMutation } from "@/src/features/virtual-estate/api/virtualEstateAPI";

import { FormControl, FormLabel } from "@mui/joy";
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
  placeName: string;
  onClose: () => void;
  place: any;
  mintPrice: number;
}

export default function MintVirtualEstateDialog({
  open,
  hexID,
  placeName,
  place,
  onClose,
  mintPrice = 10,
}: Props) {
  const { t } = useTranslation(["virtual-estate"]);
  const router = useRouter();

  const myUser = useSelector(myUserValue);
  useEffect(() => {
    if (myUser && !myUser.isPaymentPasswordSet) {
      toast.warn("请先设置支付密码");
    }
  }, [myUser]);

  const [mintVirtualEstate, mintVirtualEstateResult] =
    useMintOneVirtualEstateMutation();

  useErrorToast(mintVirtualEstateResult.error);
  useSuccessToast(
    mintVirtualEstateResult.isSuccess,
    "Mint successfully",
    () => {
      // window.location.reload();
      router.refresh();
    },
  );
  console.log(place);

  const [paymentPassword, setPaymentPassword] = useState("");

  const handleMintVritualEstate = useCallback(() => {
    mintVirtualEstate({ hexID, name: getPlaceName(place), paymentPassword });
    onClose();
  }, [hexID, mintVirtualEstate, onClose, paymentPassword, place]);

  return (
    <div>
      <ConfirmDialog
        open={open}
        title={t("virtual-estate:title.confirmMintVirtualEstate")}
        onCancel={() => {
          onClose();
        }}
        onConfirm={handleMintVritualEstate}
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
            <Typography className="w-2/3">{mintPrice}</Typography>
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

function getPlaceName(place: any) {
  console.log(place);
  let placeName = place.features.find((v: any) => {
    if (v.id.includes("place")) {
      return true;
    }
    return false;
  });

  if (!placeName) {
    placeName = place.features.find((v: any) => {
      if (v.id.includes("region")) {
        return true;
      }
      return false;
    });
  }
  if (!placeName) {
    placeName = place.features.find((v: any) => {
      if (v.id.includes("address")) {
        return true;
      }
      return false;
    });
  }

  const countryName = place.features.find((v: any) => {
    if (v.id.includes("country")) {
      return true;
    }
    return false;
  });

  return `.${placeName.text}.${countryName.text}.world`;
}
