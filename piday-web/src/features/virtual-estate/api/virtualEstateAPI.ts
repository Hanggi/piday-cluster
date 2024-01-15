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
        url: `/virtual-estates/${hexID}`,
        method: "GET",
      }),
      transformResponse: (response: { ve: VirtualEstate }) => {
        return response?.ve;
      },
    }),

    mintOneVirtualEstate: builder.mutation<VirtualEstate, { hexID: string }>({
      query: ({ hexID }) => ({
        url: `/virtual-estates/${hexID}`,
        method: "POST",
        body: {},
      }),
      transformResponse: (response: { ve: VirtualEstate }) => {
        return response?.ve;
      },
    }),
    getMyVirtualEstates: builder.query<
      {
        virtualEstates: VirtualEstate[];
        totalCount: number;
      },
      { page: number; size: number }
    >({
      query: ({ page, size }) => ({
        url: `/virtual-estates/all?page=${page}&size=${size}`,
        method: "GET",
      }),
      transformResponse: (response: {
        virtualEstates: VirtualEstate[];
        totalCount: number;
      }) => {
        return response;
      },
    }),
    getVirtualEstateBidsAndOffers: builder.query<
      VirtualEstateListing[],
      { hexID: string }
    >({
      query: ({ hexID }) => ({
        url: `/virtual-estates/${hexID}/listing`,
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
        url: `/virtual-estates/${hexID}/in-area`,
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
        url: `/virtual-estates/${hexID}/bid/${bidID}/accept`,
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
        url: `/virtual-estates/${hexID}/transactions?page=${page}&size=${size}`,
        method: "GET",
      }),
      transformResponse: (response: {
        transactions: VirtualEstateTransactionRecordInterface[];
      }) => {
        console.log(response);
        return response?.transactions;
      },
    }),
    acceptAskToBuyVirtualEstate: builder.mutation<
      VirtualEstateTransactionRecordInterface,
      { hexID: string; askID: string }
    >({
      query: ({ hexID, askID }) => ({
        url: `/virtual-estates/${hexID}/ask/${askID}/accept`,
        method: "PATCH",
      }),
      transformResponse: (response: {
        transactionRecord: VirtualEstateTransactionRecordInterface;
      }) => {
        return response?.transactionRecord;
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
  useAcceptAskToBuyVirtualEstateMutation,
} = virtualEstateRTKApi;
