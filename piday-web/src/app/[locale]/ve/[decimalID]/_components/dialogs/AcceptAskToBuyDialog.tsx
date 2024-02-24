"use client";

import PiCoinLogo from "@/src/components/piday-ui/PiCoinLogo";
import ConfirmDialog from "@/src/components/piday-ui/confirm-dialog/ConfirmDialog";
import {
  useErrorToast,
  useSuccessToast,
} from "@/src/features/rtk-utils/use-error-toast.hook";
import { VirtualEstateListing } from "@/src/features/virtual-estate-listing/interface/virtual-estate-listing.interface";
import { useAcceptAskToBuyVirtualEstateMutation } from "@/src/features/virtual-estate/api/virtualEstateAPI";

import Typography from "@mui/joy/Typography";

import { useTranslation } from "react-i18next";

interface Props {
  open: boolean;
  hexID: string;
  placeName: string;
  listing: VirtualEstateListing;
  onClose: () => void;
}

export default function AcceptAskToBuyDialog({
  open,
  onClose,
  hexID,
  placeName,
  listing,
}: Props) {
  const { t } = useTranslation(["virtual-estate"]);

  const [acceptAskToBuyVirtualEstate, acceptAskToBuyVirtualEstateResult] =
    useAcceptAskToBuyVirtualEstateMutation();

  useErrorToast(acceptAskToBuyVirtualEstateResult.error);
  useSuccessToast(
    acceptAskToBuyVirtualEstateResult.isSuccess,
    "Buy successfully",
    () => {
      window.location.reload();
    },
  );

  return (
    <div>
      <ConfirmDialog
        open={open}
        title={t("virtual-estate:title.confirmMintVirtualEstate")}
        onCancel={() => {
          onClose();
        }}
        onConfirm={() => {
          acceptAskToBuyVirtualEstate({ hexID, askID: listing.listingID });
          onClose();
        }}
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
              <Typography className="w-2/3">{listing.price}</Typography>
            </div>
          </div>
          <div className="flex mb-2">
            <Typography className="w-1/3" level="title-md">
              {t("virtual-estate:label.hashValue")}:
            </Typography>
            <Typography className="w-2/3">{hexID}</Typography>
          </div>
        </div>
      </ConfirmDialog>
    </div>
  );
}