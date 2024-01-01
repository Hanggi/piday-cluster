import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQuery } from "../../rtk-utils/fetch-base-query";
import { VirtualEstateListing } from "../../virtual-estate-listing/interface/virtual-estate-listing.interface";
import { VirtualEstateTransactionRecordInterface } from "../../virtual-estate-transaction-record/interface/virtual-estate-transaction-record-interface";
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
      { page: number; size: number }
    >({
      query: ({ page, size }) => ({
        url: `/virtual-estate/all?page=${page}&size=${size}`,
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

    acceptBidToSellVirtualEstate: builder.mutation<
      VirtualEstateTransactionRecordInterface,
      { hexID: string; bidID: string }
    >({
      query: ({ hexID, bidID }) => ({
        url: `/virtual-estate/${hexID}/bid/${bidID}/accept`,
        method: "PATCH",
      }),
      transformResponse: (response: {
        transactionRecord: VirtualEstateTransactionRecordInterface;
      }) => {
        return response?.transactionRecord;
      },
    }),
    getVirtualEstateTransactionRecords: builder.query<
      VirtualEstateTransactionRecordInterface[],
      { hexID: string; page: number; size: number }
    >({
      query: ({ hexID, page, size }) => ({
        url: `/virtual-estate/${hexID}/transactions?page=${page}&size=${size}`,
        method: "GET",
      }),
      transformResponse: (response: {
        virtualEstateTransactionRecords: VirtualEstateTransactionRecordInterface[];
      }) => {
        return response?.virtualEstateTransactionRecords;
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
  useAcceptBidToSellVirtualEstateMutation,
  useGetVirtualEstateTransactionRecordsQuery,
} = virtualEstateRTKApi;
