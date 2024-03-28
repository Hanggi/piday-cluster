"use client";

import { NumericFormatAdapter } from "@/src/components/numeric-format/NumericFormatAdapter";
import PiCoinLogo from "@/src/components/piday-ui/PiCoinLogo";
import ConfirmDialog from "@/src/components/piday-ui/confirm-dialog/ConfirmDialog";
import {
  useErrorToast,
  useSuccessToast,
} from "@/src/features/rtk-utils/use-error-toast.hook";
import { useCancelVirtualEstateListingMutation } from "@/src/features/virtual-estate-listing/api/virtualEstateListingAPI";
import { TransactionType } from "@/src/features/virtual-estate-listing/interface/virtual-estate-listing.interface";
import { signalRefreshListings } from "@/src/features/virtual-estate/virtual-estate-slice";

import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

interface Props {
  open: boolean;
  listingID: string;
  onClose: () => void;
}

export default function AskToSellDialog({ open, listingID, onClose }: Props) {
  const { t } = useTranslation(["virtual-estate"]);
  const dispatch = useDispatch();

  const [cancelVirtualEstateListing, cancelVirtualEstateListingResult] =
    useCancelVirtualEstateListingMutation();
  useErrorToast(cancelVirtualEstateListingResult.error);
  useSuccessToast(
    cancelVirtualEstateListingResult.isSuccess,
    "Cancel listing successfully",
    () => {
      dispatch(signalRefreshListings());
    },
  );

  return (
    <div>
      <ConfirmDialog
        open={open}
        title={t("virtual-estate:button.cancelListing")}
        onCancel={() => {
          onClose();
        }}
        onConfirm={() => {
         

          cancelVirtualEstateListing({
            listingID
          });

          onClose();
        }}
      >
       <div className="mt-4">
          <div className="flex mb-2">
            <Typography className="w-1/3" level="title-md">
              {t("virtual-estate:label.sureCancelTheListing")}:
            </Typography>
          </div>
        </div>
      </ConfirmDialog>
    </div>
  );
}
