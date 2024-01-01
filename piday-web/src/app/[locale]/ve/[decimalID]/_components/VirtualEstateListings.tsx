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
  useErrorToast,
  useSuccessToast,
} from "@/src/features/rtk-utils/use-error-toast.hook";
import {
  useAcceptBidToSellVirtualEstateMutation,
  useGetVirtualEstateBidsAndOffersQuery,
  useGetVirtualEstateTransactionRecordsQuery,
} from "@/src/features/virtual-estate/api/virtualEstateAPI";
import { VirtualEstate } from "@/src/features/virtual-estate/interface/virtual-estate.interface";
import { format } from "date-fns";
import { useSession } from "next-auth/react";

import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";

import { useCallback } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  hexID: string;
  virtualEstate?: VirtualEstate;
}

export default function VirtualEstateListings({ hexID, virtualEstate }: Props) {
  const { t } = useTranslation(["virtual-estate"]);

  const { data: session } = useSession();

  // Listings of bid and ask
  const { data: virtualEstateListings } = useGetVirtualEstateBidsAndOffersQuery(
    { hexID },
  );

  const { data: virtualEstateTransactionRecords } =
    useGetVirtualEstateTransactionRecordsQuery({ hexID, page: 1, size: 20 });

  console.log(
    "virtualEstateTransactionRecords",
    virtualEstateTransactionRecords,
  );
  const [acceptBidToSellVirtualEstate, acceptBidToSellVirtualEstateResult] =
    useAcceptBidToSellVirtualEstateMutation();
  useErrorToast(acceptBidToSellVirtualEstateResult.error);
  useSuccessToast(
    acceptBidToSellVirtualEstateResult.isSuccess,
    t("virtual-estate:toast.acceptBidSuccessfully"),
  );

  console.log(virtualEstateListings);

  const handelAcceptBidToSellVirtualEstate = useCallback(
    (bidID: string) => {
      acceptBidToSellVirtualEstate({
        hexID,
        bidID,
      });
    },
    [hexID, acceptBidToSellVirtualEstate],
  );

  const isMyVirtualEstate = useCallback(() => {
    return (
      !!virtualEstate?.owner?.id &&
      virtualEstate?.owner?.id == session?.user?.id
    );
  }, [session, virtualEstate?.owner]);

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
              {isMyVirtualEstate() && <TableHead>Action</TableHead>}
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
                {isMyVirtualEstate() && (
                  <TableCell>
                    <Button
                      onClick={() =>
                        handelAcceptBidToSellVirtualEstate(listing.listingID)
                      }
                    >
                      {t("virtual-estate:button.acceptBid")}
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </TableRoot>
      </div>
    </WrapperCard>
  );
}
