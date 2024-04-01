"use client";

import ConfirmDialog from "@/src/components/piday-ui/confirm-dialog/ConfirmDialog";
import {
  useErrorToast,
  useSuccessToast,
} from "@/src/features/rtk-utils/use-error-toast.hook";
import { useCancelVirtualEstateListingMutation } from "@/src/features/virtual-estate-listing/api/virtualEstateListingAPI";
import { signalRefreshListings } from "@/src/features/virtual-estate/virtual-estate-slice";

import Typography from "@mui/joy/Typography";

import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

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
    t("virtual-estate:toast.cancelListingSuccess"),
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
            listingID,
          });

          onClose();
        }}
      >
        <div className="mt-4">
          <div className="flex mb-2">
            <Typography level="title-md">
              {t("virtual-estate:label.sureCancelTheListing")}
            </Typography>
          </div>
        </div>
      </ConfirmDialog>
    </div>
  );
}
