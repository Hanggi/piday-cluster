import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQuery } from "../../rtk-utils/fetch-base-query";
import {
  TransactionType,
  VirtualEstateListing,
} from "../interface/virtual-estate-listing.interface";

export const virtualEstateListingRTKApi = createApi({
  reducerPath: "virtualEstateListingApi",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    createVirtualEstateListing: builder.mutation<
      VirtualEstateListing,
      { hexID: string; price: number; type: TransactionType }
    >({
      query: ({ hexID, price, type }) => ({
        url: `/virtual-estate-listing/${hexID}/bid`,
        method: "POST",
        body: { price, type },
      }),
      transformResponse: (response: { ve: VirtualEstateListing }) => {
        return response?.ve;
      },
    }),
  }),
});

export const { useCreateVirtualEstateListingMutation } =
  virtualEstateListingRTKApi;
