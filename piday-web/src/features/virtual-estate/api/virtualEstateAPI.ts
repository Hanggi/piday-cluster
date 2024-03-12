import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQuery } from "../../rtk-utils/fetch-base-query";
import { VirtualEstateListing } from "../../virtual-estate-listing/interface/virtual-estate-listing.interface";
import { VirtualEstateTransactionRecord } from "../../virtual-estate-transaction-record/interface/virtual-estate-transaction-record-interface";
import { VirtualEstate } from "../interface/virtual-estate.interface";

export const virtualEstateRTKApi = createApi({
  reducerPath: "virtualEstateAPI",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getLatestVirtualEstates: builder.query<
      VirtualEstate[],
      { page: number; size: number }
    >({
      query: ({ page, size }) => ({
        url: `/virtual-estates/latest?page=${page}&size=${size}`,
        method: "GET",
      }),
      transformResponse: (response: { virtualEstates: VirtualEstate[] }) => {
        return response.virtualEstates;
      },
    }),

    getOneVirtualEstate: builder.query<VirtualEstate, { hexID: string }>({
      query: ({ hexID }) => ({
        url: `/virtual-estates/${hexID}`,
        method: "GET",
      }),
      transformResponse: (response: { ve: VirtualEstate }) => {
        return response?.ve;
      },
    }),

    mintOneVirtualEstate: builder.mutation<
      VirtualEstate,
      { hexID: string; name: string }
    >({
      query: ({ hexID, name }) => ({
        url: `/virtual-estates/${hexID}`,
        method: "POST",
        body: {
          name,
        },
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
      VirtualEstateTransactionRecord,
      { hexID: string; bidID: string }
    >({
      query: ({ hexID, bidID }) => ({
        url: `/virtual-estates/${hexID}/bid/${bidID}/accept`,
        method: "PATCH",
      }),
      transformResponse: (response: {
        transactionRecord: VirtualEstateTransactionRecord;
      }) => {
        return response?.transactionRecord;
      },
    }),
    getVirtualEstateTransactionRecords: builder.query<
      VirtualEstateTransactionRecord[],
      { hexID: string; page: number; size: number }
    >({
      query: ({ hexID, page, size }) => ({
        url: `/virtual-estates/${hexID}/transactions?page=${page}&size=${size}`,
        method: "GET",
      }),
      transformResponse: (response: {
        transactions: VirtualEstateTransactionRecord[];
      }) => {
        return response?.transactions;
      },
    }),
    acceptAskToBuyVirtualEstate: builder.mutation<
      VirtualEstateTransactionRecord,
      { hexID: string; askID: string }
    >({
      query: ({ hexID, askID }) => ({
        url: `/virtual-estates/${hexID}/ask/${askID}/accept`,
        method: "PATCH",
      }),
      transformResponse: (response: {
        transactionRecord: VirtualEstateTransactionRecord;
      }) => {
        return response?.transactionRecord;
      },
    }),
    transferVirtualEstateToUser: builder.mutation<
      VirtualEstateTransactionRecord,
      { hexID: string; receiverID: string }
    >({
      query: ({ hexID, receiverID }) => ({
        url: `/virtual-estates/${hexID}/transfer`,
        method: "POST",
        body: { receiverID },
      }),
      transformResponse: (response: {
        transactionRecord: VirtualEstateTransactionRecord;
      }) => {
        return response?.transactionRecord;
      },
    }),

    getActiveListings: builder.query<
      VirtualEstate[],
      { page: number; size: number }
    >({
      query: ({ page, size }) => ({
        url: `/virtual-estates/listed?page=${page}&size=${size}`,
        method: "GET",
      }),
      transformResponse: (response: { virtualEstates: VirtualEstate[] }) => {
        return response.virtualEstates;
      },
    }),
  }),
});

export const {
  useGetLatestVirtualEstatesQuery,

  useGetOneVirtualEstateQuery,
  useMintOneVirtualEstateMutation,
  useGetMyVirtualEstatesQuery,
  useGetVirtualEstateBidsAndOffersQuery,
  useGetHexIDsStatusInAreaQuery,
  useAcceptBidToSellVirtualEstateMutation,
  useGetVirtualEstateTransactionRecordsQuery,
  useAcceptAskToBuyVirtualEstateMutation,
  useTransferVirtualEstateToUserMutation,
  useGetActiveListingsQuery,
} = virtualEstateRTKApi;
