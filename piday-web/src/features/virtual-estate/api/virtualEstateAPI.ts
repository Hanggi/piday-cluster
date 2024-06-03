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
      {
        virtualEstates: VirtualEstate[];
        totalCount: number;
      },
      { page: number; size: number }
    >({
      query: ({ page, size }) => ({
        url: `/virtual-estates/latest?page=${page}&size=${size}`,
        method: "GET",
      }),
      transformResponse: (response: {
        virtualEstates: VirtualEstate[];
        totalCount: number;
      }) => {
        return response;
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

    // Needs Payment Password ================================================
    mintOneVirtualEstate: builder.mutation<
      VirtualEstate,
      { hexID: string; name: string; paymentPassword?: string }
    >({
      query: ({ hexID, name, paymentPassword }) => ({
        url: `/virtual-estates/${hexID}`,
        method: "POST",
        body: {
          name,
          paymentPassword,
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

    // Needs Payment Password ================================================
    acceptBidToSellVirtualEstate: builder.mutation<
      VirtualEstateTransactionRecord,
      { hexID: string; bidID: string; paymentPassword?: string }
    >({
      query: ({ hexID, bidID, paymentPassword }) => ({
        url: `/virtual-estates/${hexID}/bid/${bidID}/accept`,
        method: "PATCH",
        body: {
          paymentPassword,
        },
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

    // Needs Payment Password ================================================
    acceptAskToBuyVirtualEstate: builder.mutation<
      VirtualEstateTransactionRecord,
      { hexID: string; askID: string; paymentPassword?: string }
    >({
      query: ({ hexID, askID, paymentPassword }) => ({
        url: `/virtual-estates/${hexID}/ask/${askID}/accept`,
        method: "PATCH",
        body: {
          paymentPassword,
        },
      }),
      transformResponse: (response: {
        transactionRecord: VirtualEstateTransactionRecord;
      }) => {
        return response?.transactionRecord;
      },
    }),

    // Needs Payment Password ================================================
    transferVirtualEstateToUser: builder.mutation<
      VirtualEstateTransactionRecord,
      { hexID: string; receiverID: string; paymentPassword?: string }
    >({
      query: ({ hexID, receiverID, paymentPassword }) => ({
        url: `/virtual-estates/${hexID}/transfer`,
        method: "POST",
        body: { receiverID, paymentPassword },
      }),
      transformResponse: (response: {
        transactionRecord: VirtualEstateTransactionRecord;
      }) => {
        return response?.transactionRecord;
      },
    }),

    getListedVirtualEstates: builder.query<
      {
        virtualEstates: VirtualEstate[];
        totalCount: number;
      },
      { page: number; size: number }
    >({
      query: ({ page, size }) => ({
        url: `/virtual-estates/listed?page=${page}&size=${size}`,
        method: "GET",
      }),
      transformResponse: (response: {
        virtualEstates: VirtualEstate[];
        totalCount: number;
      }) => {
        return response;
      },
    }),
    getTransactedVirtualEstates: builder.query<
      {
        virtualEstates: VirtualEstate[];
        totalCount: number;
      },
      { page: number; size: number }
    >({
      query: ({ page, size }) => ({
        url: `/virtual-estates/transacted?page=${page}&size=${size}`,
        method: "GET",
      }),
      transformResponse: (response: {
        virtualEstates: VirtualEstate[];
        totalCount: number;
      }) => {
        return response;
      },
    }),
    searchVirtualEstates: builder.query<
      VirtualEstate[],
      { page: number; size: number; name: string }
    >({
      query: ({ page, size, name }) => ({
        url: `/virtual-estates/search?page=${page}&size=${size}&name=${name}`,
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
  useGetListedVirtualEstatesQuery,
  useGetTransactedVirtualEstatesQuery,
  useSearchVirtualEstatesQuery,
  useLazySearchVirtualEstatesQuery,
} = virtualEstateRTKApi;
