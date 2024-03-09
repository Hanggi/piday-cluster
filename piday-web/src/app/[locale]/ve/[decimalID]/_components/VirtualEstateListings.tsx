"use client";

import { WrapperCard } from "@/src/components/WrapperCard";
import {
  useErrorToast,
  useSuccessToast,
} from "@/src/features/rtk-utils/use-error-toast.hook";
import {
  useAcceptBidToSellVirtualEstateMutation,
  useGetVirtualEstateBidsAndOffersQuery,
} from "@/src/features/virtual-estate/api/virtualEstateAPI";
import { VirtualEstate } from "@/src/features/virtual-estate/interface/virtual-estate.interface";
import { format } from "date-fns";
import { useSession } from "next-auth/react";

import Button from "@mui/joy/Button";
import Table from "@mui/joy/Table";
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

  const [acceptBidToSellVirtualEstate, acceptBidToSellVirtualEstateResult] =
    useAcceptBidToSellVirtualEstateMutation();
  useErrorToast(acceptBidToSellVirtualEstateResult.error);
  useSuccessToast(
    acceptBidToSellVirtualEstateResult.isSuccess,
    t("virtual-estate:toast.acceptBidSuccessfully"),
  );

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
                      onClick={() =>
                        handelAcceptBidToSellVirtualEstate(listing.listingID)
                      }
                    >
                      {t("virtual-estate:button.acceptBid")}
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </WrapperCard>
  );
}
