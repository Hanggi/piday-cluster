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
    getActiveListings: builder.query<
      VirtualEstateListing[],
      { page: number; size: number }
    >({
      query: ({ page, size }) => ({
        url: `/virtual-estate-listing/active?page=${page}&size=${size}`,
        method: "GET",
      }),
      transformResponse: (response: {
        virtualEstateListings: VirtualEstateListing[];
      }) => {
        return response.virtualEstateListings;
      },
    }),
  }),
});

export const { useCreateVirtualEstateListingMutation } =
  virtualEstateListingRTKApi;
