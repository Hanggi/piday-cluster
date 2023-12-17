import { TransactionType } from "@/src/utils/types";
import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQuery } from "../../rtk-utils/fetch-base-query";
import { VirtualEstateListing } from "../interface/virtual-estate-listing.interface";

export const virtualEstateListingRTKApi = createApi({
  reducerPath: "virtualEstateListingApi",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    createVirtualEstateListing: builder.mutation<
      VirtualEstateListing,
      { hexID: string; price: number; type: TransactionType; expiresAt?: Date }
    >({
      query: ({ hexID, price, type, expiresAt }) => ({
        url: `/virtual-estate-listing/${hexID}/bid`,
        method: "POST",
        body: { price, type, expiresAt },
      }),
      transformResponse: (response: { ve: VirtualEstateListing }) => {
        return response?.ve;
      },
    }),
  }),
});

export const { useCreateVirtualEstateListingMutation } =
  virtualEstateListingRTKApi;
