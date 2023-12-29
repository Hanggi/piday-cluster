"use client";

import ConfirmDialog from "@/src/components/piday-ui/confirm-dialog/ConfirmDialog";
import {
  useErrorToast,
  useSuccessToast,
} from "@/src/features/rtk-utils/use-error-toast.hook";
import { useMintOneVirtualEstateMutation } from "@/src/features/virtual-estate/api/virtualEstateAPI";

import Typography from "@mui/joy/Typography";

import { useTranslation } from "react-i18next";

interface Props {
  open: boolean;
  hexID: string;
  placeName: string;
  onClose: () => void;
}

export default function MintVirtualEstateDialog({
  open,
  hexID,
  placeName,
  onClose,
}: Props) {
  const { t } = useTranslation(["virtual-estate"]);

  const [mintVirtualEstate, mintVirtualEstateResult] =
    useMintOneVirtualEstateMutation();
  useErrorToast(mintVirtualEstateResult.error);
  useSuccessToast(
    mintVirtualEstateResult.isSuccess,
    "Mint successfully",
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
          mintVirtualEstate({ hexID });
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
            <Typography className="w-2/3">10</Typography>
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
