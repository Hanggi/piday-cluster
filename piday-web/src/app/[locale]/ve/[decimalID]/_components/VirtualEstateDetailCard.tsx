"use client";

import { useCreateVirtualEstateListingMutation } from "@/src/features/virtual-estate-listing/api/virtualEstateListingAPI";
import { TransactionType } from "@/src/features/virtual-estate-listing/interface/virtual-estate-listing.interface";
import { useGetPlacesQuery } from "@/src/features/virtual-estate/api/mapboxAPI";
import {
  useAcceptBidToSellVirtualEstateMutation,
  useGetOneVirtualEstateQuery,
  useGetVirtualEstateBidsAndOffersQuery,
  useMintOneVirtualEstateMutation,
} from "@/src/features/virtual-estate/api/virtualEstateAPI";
import { format } from "date-fns";
import { h3ToGeo } from "h3-js";
import { useSession } from "next-auth/react";

import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";

import { useCallback, useState } from "react";

interface Props {
  hexID: string;
}

export default function VirtualEstateDetailCard({ hexID }: Props) {
  const { data: session, status } = useSession();
  const geo = h3ToGeo(hexID);
  const { data: place } = useGetPlacesQuery({
    lat: geo[0],
    lng: geo[1],
  });

  const { data: virtualEstate } = useGetOneVirtualEstateQuery({ hexID });

  const { data: virtualEstateListings } = useGetVirtualEstateBidsAndOffersQuery(
    { hexID },
  );

  const [bidID, setBidID] = useState("");

  const [mintVirtualEstate, mintVirtualEstateResult] =
    useMintOneVirtualEstateMutation();

  const [acceptBidToSellVirtualEstate, acceptBidToSellVirtualEstateResult] =
  useAcceptBidToSellVirtualEstateMutation();

  const handleMintClick = useCallback(() => {
    mintVirtualEstate({ hexID });
  }, [hexID, mintVirtualEstate]);
  const [createVirtualEstateListing, createVirtualEstateListingResult] =
    useCreateVirtualEstateListingMutation();

  const handleBidClick = useCallback(() => {
    createVirtualEstateListing({
      hexID,
      price: 12,
      type: TransactionType.BID,
    });
  }, [hexID, createVirtualEstateListing]);

  const handelAcceptBidToSellVirtualEstate = useCallback(() => {
    acceptBidToSellVirtualEstate({
      hexID,
      bidID,
    });
  }, [hexID, bidID, acceptBidToSellVirtualEstate]);

  return (
    <div className="w-full relative pt-5">
      <h1 className="text-3xl font-semibold">country.country</h1>
      <div className="mt-5 p-6 bg-[#F7F7F7] rounded-xl">
        <div className="grid grid-cols-2 py-5">
          <div>
            <Typography className="opacity-40" level="title-md">
              地址
            </Typography>
            <Typography>{place?.features[0].place_name}</Typography>
          </div>
          <div>
            <Typography className="opacity-40" level="title-md">
              哈希值
            </Typography>
            <Typography>{hexID}</Typography>
          </div>
        </div>
        <hr />
        <div className="grid grid-cols-2 py-5">
          <div>
            <Typography className="opacity-40" level="title-md">
              土地铸造时间
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
            <Typography className="opacity-40">持有人</Typography>
            <Typography>{virtualEstate?.owner.username || "None"}</Typography>
          </div>
        </div>
        <hr />
        <div className="py-5">
          <Typography className="opacity-40" level="title-md">
            最后价格
          </Typography>
          <Typography className="text-2xl">
            {virtualEstate?.lastPrice || 25}
          </Typography>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-7">
        {!virtualEstate && <Button>Buy</Button>}

        {/* {virtualEstate?.owner?.id == session?.user?.id && <div></div>} */}
        <Button className="py-3 grow" size="lg" onClick={handleMintClick}>
          购买
        </Button>
        <Button className="py-3 grow" size="lg">
          转移
        </Button>
      </div>
    </div>
  );
}
