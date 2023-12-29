"use client";

import { NumericFormatAdapter } from "@/src/components/numeric-format/NumericFormatAdapter";
import ConfirmDialog from "@/src/components/piday-ui/confirm-dialog/ConfirmDialog";
import { useGetBalanceQuery } from "@/src/features/account/api/accountAPI";
import { useCreateVirtualEstateListingMutation } from "@/src/features/virtual-estate-listing/api/virtualEstateListingAPI";
import { TransactionType } from "@/src/features/virtual-estate-listing/interface/virtual-estate-listing.interface";

import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";

import Image from "next/image";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

interface Props {
  open: boolean;
  hexID: string;
  onClose: () => void;
}

export default function BidToBuyDialog({ open, hexID, onClose }: Props) {
  const { t } = useTranslation(["virtual-estate"]);

  const [createVirtualEstateListing, createVirtualEstateListingResult] =
    useCreateVirtualEstateListingMutation();

  const { data: balance } = useGetBalanceQuery({});

  const [bidAmount, setBidAmount] = useState(0);

  return (
    <div>
      <ConfirmDialog
        open={open}
        title={t("virtual-estate:button.bidToBuy")}
        onCancel={() => {
          onClose();
        }}
        onConfirm={() => {
          if (bidAmount > +balance || bidAmount == 0) {
            // Balance is string, convert to number
            toast.warn(t("virtual-estate:toast.invalidAmount"));
            return;
          }

          createVirtualEstateListing({
            hexID,
            price: Number(bidAmount),
            type: TransactionType.BID,
          });

          onClose();
        }}
      >
        <div className="mt-4">
          <div className="flex mb-2">
            <Typography className="w-1/3" level="title-md">
              {t("virtual-estate:label.availableBalance")}:
            </Typography>
            <Typography className="w-2/3">{balance || 0}</Typography>
          </div>
          <div className="mb-2">
            <FormControl error={bidAmount > +balance}>
              <FormLabel>{t("virtual-estate:label.bidAmount")}:</FormLabel>
              <Input
                endDecorator={
                  <div className="w-6 h-6 relative">
                    <Image alt="PiCoin" fill src="/images/pi-coin.png" />
                  </div>
                }
                placeholder={t(
                  "virtual-estate:placeholder.bidAmountPlaceholder",
                )}
                slotProps={{
                  input: {
                    component: NumericFormatAdapter,
                  },
                }}
                value={bidAmount}
                onChange={(e) => {
                  setBidAmount(Number(e.target.value));
                }}
              />
              {bidAmount > +balance && (
                <FormHelperText>
                  {t("virtual-estate:form.noEnoughBalance")}
                </FormHelperText>
              )}
            </FormControl>
          </div>
        </div>
      </ConfirmDialog>
    </div>
  );
}
