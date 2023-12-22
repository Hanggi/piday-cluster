import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQuery } from "../../rtk-utils/fetch-base-query";
import { VirtualEstateListing } from "../../virtual-estate-listing/interface/virtual-estate-listing.interface";
import { VirtualEstate } from "../interface/virtual-estate.interface";

export const virtualEstateRTKApi = createApi({
  reducerPath: "virtualEstateAPI",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getOneVirtualEstate: builder.query<VirtualEstate, { hexID: string }>({
      query: ({ hexID }) => ({
        url: `/virtual-estate/${hexID}`,
        method: "GET",
      }),
      transformResponse: (response: { ve: VirtualEstate }) => {
        return response?.ve;
      },
    }),

    mintOneVirtualEstate: builder.mutation<VirtualEstate, { hexID: string }>({
      query: ({ hexID }) => ({
        url: `/virtual-estate/${hexID}`,
        method: "POST",
        body: {},
      }),
      transformResponse: (response: { ve: VirtualEstate }) => {
        return response?.ve;
      },
    }),
    getMyVirtualEstates: builder.query<
      VirtualEstate[],
      { page: string; size: string }
    >({
      query: ({ page, size }) => ({
        url: `/virtual-estates?page=${page}&size=${size}`,
        method: "GET",
      }),
      transformResponse: (response: { virtualEstates: VirtualEstate[] }) => {
        return response?.virtualEstates;
      },
    }),
    getVirtualEstateBidsAndOffers: builder.query<
      VirtualEstateListing[],
      { hexID: string }
    >({
      query: ({ hexID }) => ({
        url: `/virtual-estate/${hexID}/listing`,
        method: "GET",
      }),
      transformResponse: (response: {
        virtualEstateListings: VirtualEstateListing[];
      }) => {
        return response?.virtualEstateListings;
      },
    }),
    getHexIDsStatusInArea: builder.query<
      { onSale: string[]; sold: string[] },
      { hexID: string }
    >({
      query: ({ hexID }) => ({
        url: `/virtual-estate/${hexID}/in-area`,
        method: "GET",
      }),
      transformResponse: (response: { onSale: string[]; sold: string[] }) => {
        return response;
      },
    }),
  }),
});

export const {
  useGetOneVirtualEstateQuery,
  useMintOneVirtualEstateMutation,
  useGetMyVirtualEstatesQuery,
  useGetVirtualEstateBidsAndOffersQuery,
  useGetHexIDsStatusInAreaQuery,
} = virtualEstateRTKApi;
