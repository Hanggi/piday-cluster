"use client";

import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  Table as TableRoot,
  TableRow,
} from "@/src/components/Table";
import { WrapperCard } from "@/src/components/WrapperCard";
import {
  useAcceptBidToSellVirtualEstateMutation,
  useGetVirtualEstateBidsAndOffersQuery,
} from "@/src/features/virtual-estate/api/virtualEstateAPI";
import { format } from "date-fns";
import { useSession } from "next-auth/react";

import Typography from "@mui/joy/Typography";

import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  hexID: string;
}

export default function VirtualEstateListings({ hexID }: Props) {
  const { t } = useTranslation(["virtual-estate"]);

  const { data: session } = useSession();

  // Listings of bid and ask
  const { data: virtualEstateListings } = useGetVirtualEstateBidsAndOffersQuery(
    { hexID },
  );

  const [acceptBidToSellVirtualEstate, acceptBidToSellVirtualEstateResult] =
    useAcceptBidToSellVirtualEstateMutation();

  const [bidID, setBidID] = useState("");

  const handelAcceptBidToSellVirtualEstate = useCallback(() => {
    acceptBidToSellVirtualEstate({
      hexID,
      bidID,
    });
  }, [hexID, bidID, acceptBidToSellVirtualEstate]);

  return (
    <WrapperCard className="container mx-auto">
      <Typography level="h3">{t("virtual-estate:label.currentBid")}</Typography>
      <div>
        <TableRoot aria-label="basic table">
          <TableHeader>
            <TableRow>
              <TableHead>Listing ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Expires At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {virtualEstateListings?.map((listing, i) => (
              <TableRow key={i}>
                <TableCell>{listing.listingID}</TableCell>
                <TableCell>
                  <i className="ri-user-line"></i>
                  {listing?.owner?.username}
                </TableCell>
                <TableCell>{listing.price}</TableCell>
                <TableCell>
                  {format(new Date(listing?.createdAt), "PPpp")}
                </TableCell>
                <TableCell>
                  {format(new Date(listing?.expiresAt), "PPpp")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableRoot>
      </div>
    </WrapperCard>
  );
}
