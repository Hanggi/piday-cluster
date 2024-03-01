"use client";

import ConfirmDialog from "@/src/components/piday-ui/confirm-dialog/ConfirmDialog";
import {
  useErrorToast,
  useSuccessToast,
} from "@/src/features/rtk-utils/use-error-toast.hook";
import { useMintOneVirtualEstateMutation } from "@/src/features/virtual-estate/api/virtualEstateAPI";

import Typography from "@mui/joy/Typography";

import { useRouter } from "next/navigation";

import { useCallback } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  open: boolean;
  hexID: string;
  placeName: string;
  onClose: () => void;
  place: any;
}

export default function MintVirtualEstateDialog({
  open,
  hexID,
  placeName,
  place,
  onClose,
}: Props) {
  const { t } = useTranslation(["virtual-estate"]);
  const router = useRouter();

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

  const handleMintVritualEstate = useCallback(() => {
    mintVirtualEstate({ hexID, name: getPlaceName(place) });
    onClose();
  }, [hexID, mintVirtualEstate, onClose, place]);

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

function getPlaceName(place: any) {
  console.log(place);
  const placeName = place.features.find((v: any) => {
    if (v.id.includes("place")) {
      return true;
    }
    return false;
  });

  const countryName = place.features.find((v: any) => {
    if (v.id.includes("country")) {
      return true;
    }
    return false;
  });

  return `.${placeName.text}.${countryName.text}.world`;
}
