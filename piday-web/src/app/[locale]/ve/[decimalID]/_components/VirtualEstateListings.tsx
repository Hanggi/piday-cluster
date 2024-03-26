"use client";

import { WrapperCard } from "@/src/components/WrapperCard";
import { VirtualEstateListing } from "@/src/features/virtual-estate-listing/interface/virtual-estate-listing.interface";
import { useGetVirtualEstateBidsAndOffersQuery } from "@/src/features/virtual-estate/api/virtualEstateAPI";
import { VirtualEstate } from "@/src/features/virtual-estate/interface/virtual-estate.interface";
import { shouldRefreshListingsValue } from "@/src/features/virtual-estate/virtual-estate-slice";
import { format } from "date-fns";
import { useSession } from "next-auth/react";

import Button from "@mui/joy/Button";
import Table from "@mui/joy/Table";
import Typography from "@mui/joy/Typography";

import { useRouter } from "next/navigation";

import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import AcceptBidToSellDialog from "./dialogs/AcceptBidToSellDialog";

interface Props {
  hexID: string;
  virtualEstate?: VirtualEstate;
}

export default function VirtualEstateListings({ hexID, virtualEstate }: Props) {
  const { t } = useTranslation(["virtual-estate"]);
  const router = useRouter();

  const { data: session } = useSession();

  const shouldRefreshListings = useSelector(shouldRefreshListingsValue);
  // Listings of bid and ask
  const { data: virtualEstateListings, refetch: refetchVEListings } =
    useGetVirtualEstateBidsAndOffersQuery({ hexID });

  const [selectedListing, setSelectedListing] =
    useState<VirtualEstateListing>();
  const [openAcceptBidToSellDialog, setOpenAcceptAskToBuyDialog] =
    useState(false);

  const isMyVirtualEstate = useCallback(() => {
    return (
      !!virtualEstate?.owner?.id &&
      virtualEstate?.owner?.id == session?.user?.id
    );
  }, [session, virtualEstate?.owner]);

  useEffect(() => {
    refetchVEListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldRefreshListings]);

  return (
    <WrapperCard className="container mx-auto">
      <Typography level="h3">{t("virtual-estate:label.currentBid")}</Typography>
      <div>
        <Table aria-label="basic table" hoverRow noWrap stripe="even">
          <thead>
            <tr>
              <th>
                <Typography>{t("virtual-estate:table.listingID")}</Typography>
              </th>
              <th>
                <Typography>{t("virtual-estate:table.user")}</Typography>
              </th>
              <th>
                <Typography>{t("virtual-estate:table.price")}</Typography>
              </th>
              <th>
                <Typography>{t("virtual-estate:table.createdAt")}</Typography>
              </th>
              <th>
                <Typography>{t("virtual-estate:table.expiresAt")}</Typography>
              </th>
              {isMyVirtualEstate() && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {virtualEstateListings?.map((listing, i) => (
              <tr key={i}>
                <td>
                  <Typography>{listing.listingID}</Typography>
                </td>
                <td>
                  <Typography>
                    <i className="ri-user-line"></i>
                    {listing?.owner?.username}
                  </Typography>
                </td>
                <td>
                  <Typography>{listing.price}</Typography>
                </td>
                <td>
                  <Typography>
                    {format(new Date(listing?.createdAt), "PPpp")}
                  </Typography>
                </td>
                <td>
                  <Typography>
                    {format(new Date(listing?.expiresAt), "PPpp")}
                  </Typography>
                </td>
                {isMyVirtualEstate() && (
                  <td>
                    <Button
                      onClick={() => {
                        // handelAcceptBidToSellVirtualEstate(listing.listingID)
                        setSelectedListing(listing);
                        setOpenAcceptAskToBuyDialog(true);
                      }}
                    >
                      {t("virtual-estate:button.acceptBid")}
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
        {selectedListing && (
          <AcceptBidToSellDialog
            hexID={hexID}
            listing={selectedListing}
            open={openAcceptBidToSellDialog}
            placeName={virtualEstate?.name as string}
            onClose={() => {
              setOpenAcceptAskToBuyDialog(false);
            }}
            onConfirm={() => {
              router.refresh();
              refetchVEListings();
            }}
          />
        )}
      </div>
    </WrapperCard>
  );
}
