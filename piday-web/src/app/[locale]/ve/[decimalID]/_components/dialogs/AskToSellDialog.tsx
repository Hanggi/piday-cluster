"use client";

import { NumericFormatAdapter } from "@/src/components/numeric-format/NumericFormatAdapter";
import PiCoinLogo from "@/src/components/piday-ui/PiCoinLogo";
import ConfirmDialog from "@/src/components/piday-ui/confirm-dialog/ConfirmDialog";
import {
  useErrorToast,
  useSuccessToast,
} from "@/src/features/rtk-utils/use-error-toast.hook";
import { useCreateVirtualEstateListingMutation } from "@/src/features/virtual-estate-listing/api/virtualEstateListingAPI";
import { TransactionType } from "@/src/features/virtual-estate-listing/interface/virtual-estate-listing.interface";

import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

interface Props {
  open: boolean;
  hexID: string;
  onClose: () => void;
}

export default function AskToSellDialog({ open, hexID, onClose }: Props) {
  const { t } = useTranslation(["virtual-estate"]);

  const [askAmount, setAskAmount] = useState(0);

  const [createVirtualEstateListing, createVirtualEstateListingResult] =
    useCreateVirtualEstateListingMutation();
  useErrorToast(createVirtualEstateListingResult.error);
  useSuccessToast(
    createVirtualEstateListingResult.isSuccess,
    "Ask successfully",
    () => {
      // TODO: Reload the listing table
    },
  );

  return (
    <div>
      <ConfirmDialog
        open={open}
        title={t("virtual-estate:button.askToSell")}
        onCancel={() => {
          onClose();
        }}
        onConfirm={() => {
          if (askAmount <= 0) {
            // Balance is string, convert to number
            toast.warn(t("virtual-estate:toast.invalidAmount"));
            return;
          }

          createVirtualEstateListing({
            hexID,
            price: Number(askAmount),
            type: TransactionType.ASK,
          });

          onClose();
        }}
      >
        <div className="mt-4">
          <div className="flex mb-2">
            <Typography className="w-1/3" level="title-md">
              {t("virtual-estate:label.availableBalance")}:
            </Typography>
          </div>
          <div className="mb-2">
            <FormControl>
              <FormLabel>{t("virtual-estate:label.askAmount")}:</FormLabel>
              <Input
                endDecorator={
                  <div className="w-6 h-6 relative">
                    <PiCoinLogo />
                  </div>
                }
                placeholder={t(
                  "virtual-estate:placeholder.askAmountPlaceholder",
                )}
                slotProps={{
                  input: {
                    component: NumericFormatAdapter,
                  },
                }}
                value={askAmount}
                onChange={(e) => {
                  setAskAmount(Number(e.target.value));
                }}
              />
            </FormControl>
          </div>
        </div>
      </ConfirmDialog>
    </div>
  );
}
