"use client";

import { useCreateVirtualEstateListingMutation } from "@/src/features/virtual-estate-listing/api/virtualEstateListingAPI";
import { TransactionType } from "@/src/features/virtual-estate-listing/interface/virtual-estate-listing.interface";
import { useGetPlacesQuery } from "@/src/features/virtual-estate/api/mapboxAPI";
import { VirtualEstate } from "@/src/features/virtual-estate/interface/virtual-estate.interface";
import { format } from "date-fns";
import { h3ToGeo } from "h3-js";
import { useSession } from "next-auth/react";

import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";

import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import BidToBuyDialog from "./dialogs/BidToBuyDialog";
import MintVirtualEstateDialog from "./dialogs/MintVirtualEstateDialog";

interface Props {
  hexID: string;
  virtualEstate?: VirtualEstate;
}

export default function VirtualEstateDetailCard({
  hexID,
  virtualEstate,
}: Props) {
  const { t } = useTranslation(["virtual-estate"]);
  const { data: session, status } = useSession();
  const geo = h3ToGeo(hexID);
  const { data: place } = useGetPlacesQuery({
    lat: geo[0],
    lng: geo[1],
  });

  // Dialogs
  const [openMintVirtualEstateDialog, setOpenMintVirtualEstateDialog] =
    useState(false);
  const [openBidToBuyDialog, setOpenBidToBuyDialog] = useState(false);

  const handleOpenMintDialog = useCallback(() => {
    setOpenMintVirtualEstateDialog(true);
  }, []);
  const handleOpenBidToBuyDialog = useCallback(() => {
    setOpenBidToBuyDialog(true);
  }, []);

  const isMyVirtualEstate = useCallback(() => {
    return (
      !!virtualEstate?.owner?.id &&
      virtualEstate?.owner?.id == session?.user?.id
    );
  }, [session, virtualEstate?.owner]);

  const placeName = place?.features[0].text;
  const placeAddress = place?.features[0].place_name;

  return (
    <div className="w-full relative pt-5">
      <h1 className="text-3xl font-semibold">{placeName}</h1>
      <div className="mt-5 p-6 bg-[#F7F7F7] rounded-xl">
        <div className="grid grid-cols-2 py-5">
          <div>
            <Typography className="opacity-40" level="title-md">
              {t("virtual-estate:label.address")}
            </Typography>
            <Typography>{placeAddress}</Typography>
          </div>
          <div>
            <Typography className="opacity-40" level="title-md">
              {t("virtual-estate:label.hashValue")}
            </Typography>
            <Typography>{hexID}</Typography>
          </div>
        </div>
        <hr />
        <div className="grid grid-cols-2 py-5">
          <div>
            <Typography className="opacity-40" level="title-md">
              {t("virtual-estate:label.estateMintTime")}
            </Typography>
            <Typography>
              {virtualEstate
                ? format(
                    new Date(virtualEstate?.createdAt),
                    "yyyy-MM-dd HH:mm:ss",
                  )
                : "NaN"}
            </Typography>
          </div>
          <div>
            <Typography className="opacity-40">
              {t("virtual-estate:label.owner")}
            </Typography>
            <Typography>{virtualEstate?.owner.username || "None"}</Typography>
          </div>
        </div>
        <hr />
        <div className="py-5">
          <Typography className="opacity-40" level="title-md">
            {t("virtual-estate:label.lastPrice")}
          </Typography>
          <Typography className="text-2xl">
            {virtualEstate?.lastPrice || 10}
          </Typography>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-7">
        {isMyVirtualEstate() && (
          <div className="w-full flex gap-4">
            <Button className="grow" size="lg">
              {t("virtual-estate:button.askToSell")}
            </Button>
            <Button className="py-3 grow" size="lg">
              {t("virtual-estate:button.transfer")}
            </Button>
          </div>
        )}
        {!virtualEstate?.owner && (
          <Button
            className="py-3 grow"
            size="lg"
            onClick={handleOpenMintDialog}
          >
            {t("virtual-estate:button.genesisMint")}
          </Button>
        )}
        {!isMyVirtualEstate() && !!virtualEstate?.owner && (
          <Button
            className="py-3 grow"
            size="lg"
            onClick={handleOpenBidToBuyDialog}
          >
            {t("virtual-estate:button.bidToBuy")}
          </Button>
        )}
      </div>

      {/* Dialogs */}
      <MintVirtualEstateDialog
        hexID={hexID}
        open={openMintVirtualEstateDialog}
        placeName={placeName}
        onClose={() => {
          setOpenMintVirtualEstateDialog(false);
        }}
      />

      <BidToBuyDialog
        hexID={hexID}
        open={openBidToBuyDialog}
        onClose={() => {
          setOpenBidToBuyDialog(false);
        }}
      />
    </div>
  );
}
