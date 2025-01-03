"use client";

import PiCoinLogo from "@/src/components/piday-ui/PiCoinLogo";
import VirtualEstateLevelChip from "@/src/components/virtual-estate-level/VitrualEstateLevelChip";
import { useLazyGetMyUserQuery } from "@/src/features/auth/api/authAPI";
import { myUserValue } from "@/src/features/user/user-slice";
import { VirtualEstateListing } from "@/src/features/virtual-estate-listing/interface/virtual-estate-listing.interface";
import { useGetPlacesQuery } from "@/src/features/virtual-estate/api/mapboxAPI";
import { VirtualEstate } from "@/src/features/virtual-estate/interface/virtual-estate.interface";
import { format } from "date-fns";
import { h3ToGeo } from "h3-js";
import { useSession } from "next-auth/react";

import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";

import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import AcceptAskToBuyDialog from "./dialogs/AcceptAskToBuyDialog";
import AskToSellDialog from "./dialogs/AskToSellDialog";
import BidToBuyDialog from "./dialogs/BidToBuyDialog";
import CancelListinglDialog from "./dialogs/CancelListingDialog";
import MintVirtualEstateDialog from "./dialogs/MintVirtualEstateDialog";
import TransferVirtualEstateDialog from "./dialogs/TransferDialog";

interface Props {
  hexID: string;
  virtualEstate?: VirtualEstate;
  listing?: VirtualEstateListing;
  mintPrice: number;
}

export default function VirtualEstateDetailCard({
  hexID,
  virtualEstate,
  listing,
  mintPrice,
}: Props) {
  const { t } = useTranslation(["virtual-estate"]);
  const { data: session, status } = useSession();
  const geo = h3ToGeo(hexID);
  const { data: place } = useGetPlacesQuery({
    lat: geo[0],
    lng: geo[1],
  });

  const myUser = useSelector(myUserValue);
  const [getMyUserTrigger, { data: myUserData, isLoading: isLoadingMyUser }] =
    useLazyGetMyUserQuery();
  useEffect(() => {
    if (!myUser) {
      getMyUserTrigger();
    }
  }, [getMyUserTrigger, myUser]);

  // Dialogs
  const [openMintVirtualEstateDialog, setOpenMintVirtualEstateDialog] =
    useState(false);
  const [openBidToBuyDialog, setOpenBidToBuyDialog] = useState(false);
  const [openAskToSellDialog, setOpenAskToSellDialog] = useState(false);
  const [openAcceptAskToBuyDialog, setOpenAcceptAskToBuyDialog] =
    useState(false);
  const [openTransferVirtualEstateDialog, setOpenTransferVirtualEstateDialog] =
    useState(false);
  const [openCancelListingDialog, setOpenCancelListingDialog] = useState(false);

  const handleOpenMintDialog = useCallback(() => {
    if (!place) return;
    setOpenMintVirtualEstateDialog(true);
  }, [place]);
  const handleOpenBidToBuyDialog = useCallback(() => {
    setOpenBidToBuyDialog(true);
  }, []);
  const handleOpenAskToSellDialog = useCallback(() => {
    setOpenAskToSellDialog(true);
  }, []);
  const handleOpenAcceptToBuyDialog = useCallback(() => {
    setOpenAcceptAskToBuyDialog(true);
  }, []);
  const handleOpenTransferDialog = useCallback(() => {
    setOpenTransferVirtualEstateDialog(true);
  }, []);
  const handleOpenCancelListingDialog = useCallback(() => {
    setOpenCancelListingDialog(true);
  }, []);

  const isMyVirtualEstate = useCallback(() => {
    return (
      !!virtualEstate?.owner?.id &&
      virtualEstate?.owner?.id == session?.user?.id
    );
  }, [session, virtualEstate?.owner]);

  const placeName = place?.features[0]?.text;
  const placeAddress = place?.features[0]?.place_name;

  return (
    <div className="w-full relative pt-5">
      <div>
        <Typography level="h2">{virtualEstate?.name}</Typography>
        <VirtualEstateLevelChip level={virtualEstate?.level} />
      </div>
      <div className="mt-5 p-6 bg-[#F7F7F7] rounded-xl">
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 py-5">
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
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 py-5">
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
        <div className="py-5 grid gap-4 grid-cols-1 lg:grid-cols-2">
          <div>
            <Typography className="opacity-40" level="title-md">
              {t("virtual-estate:label.lastPrice")}
            </Typography>
            <Typography level="title-md">
              {virtualEstate?.lastPrice || mintPrice || "Free"}
            </Typography>
          </div>
          {listing && (
            <div>
              <Typography className="opacity-40" level="title-md">
                {t("virtual-estate:label.sellingPrice")}
              </Typography>
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <div className="w-6 h-6 relative">
                    <PiCoinLogo />
                  </div>
                  <Typography level="title-md">{listing.price}</Typography>
                </div>

                {/* Only owner could cancel the listing. */}
                {isMyVirtualEstate() && (
                  <div className="mt-2">
                    <Button
                      color="neutral"
                      variant="outlined"
                      onClick={handleOpenCancelListingDialog}
                    >
                      {t("virtual-estate:button.cancelListing")}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-7">
        {/* SELL */}
        {isMyVirtualEstate() && (
          <div className="w-full flex flex-wrap gap-4">
            <Button
              className="grow"
              size="lg"
              onClick={handleOpenAskToSellDialog}
            >
              {t("virtual-estate:button.askToSell")}
            </Button>
            <Button
              className="py-3 grow"
              size="lg"
              onClick={handleOpenTransferDialog}
            >
              {t("virtual-estate:button.transfer")}
            </Button>
          </div>
        )}

        {/* MINT */}
        {!virtualEstate?.owner && (
          <Button
            className="py-3 grow"
            disabled={!place}
            size="lg"
            onClick={handleOpenMintDialog}
          >
            {t("virtual-estate:button.genesisMint")}
          </Button>
        )}

        {/* BUY */}
        {!isMyVirtualEstate() && !!virtualEstate?.owner && (
          <div className="w-full flex gap-4">
            <Button
              className="py-3 w-full"
              size="lg"
              onClick={handleOpenBidToBuyDialog}
            >
              {t("virtual-estate:button.bidToBuy")}
            </Button>

            {listing && (
              <Button className="w-full" onClick={handleOpenAcceptToBuyDialog}>
                {t("virtual-estate:button.buy")}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Dialogs */}
      <MintVirtualEstateDialog
        hexID={hexID}
        mintPrice={mintPrice}
        open={openMintVirtualEstateDialog}
        place={place}
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

      <AskToSellDialog
        hexID={hexID}
        open={openAskToSellDialog}
        onClose={() => {
          setOpenAskToSellDialog(false);
        }}
      />

      {listing && (
        <AcceptAskToBuyDialog
          hexID={hexID}
          listing={listing}
          open={openAcceptAskToBuyDialog}
          placeName={placeName}
          onClose={() => {
            setOpenAcceptAskToBuyDialog(false);
          }}
        />
      )}

      <TransferVirtualEstateDialog
        hexID={hexID}
        open={openTransferVirtualEstateDialog}
        onClose={() => {
          setOpenTransferVirtualEstateDialog(false);
        }}
      />

      {listing && listing.listingID && (
        <CancelListinglDialog
          listingID={listing.listingID}
          open={openCancelListingDialog}
          onClose={() => {
            setOpenCancelListingDialog(false);
          }}
        />
      )}
    </div>
  );
}
