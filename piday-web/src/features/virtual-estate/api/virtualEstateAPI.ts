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
      VirtualEstate[],
      { page: string; size: string }
    >({
      query: ({ page, size }) => ({
        url: `/virtual-estates/all?page=${page}&size=${size}`,
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
      any,
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
    getVirtualEstateStatistics: builder.query<
      VirtualEstate[],
      {
        totalMinted: boolean;
        listings: boolean;
        transactionVolume: boolean;
        transactionCount: boolean;
        startDate: string;
        endDate: string;
      }
    >({
      query: ({
        totalMinted,
        listings,
        transactionVolume,
        transactionCount,
        startDate,
        endDate,
      }) => ({
        url: `/virtual-estates/statistics?totalMinted=${totalMinted}&listings=${listings}&transactionVolume=${transactionVolume}&transactionCount=${transactionCount}&startDate=${startDate}&endDate=${endDate}`,
        method: "GET",
      }),
      transformResponse: (response: { virtualEstates: VirtualEstate[] }) => {
        return response?.virtualEstates;
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
  useGetVirtualEstateStatisticsQuery,
} = virtualEstateRTKApi;
