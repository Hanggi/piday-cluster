import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQuery } from "../../rtk-utils/fetch-base-query";
import { VirtualEstateTransactionRecordInterface as VirtualEstateTransactionRecord } from "../../virtual-estate-transaction-record/interface/virtual-estate-transaction-record-interface";

export const transactionAdminAPI = createApi({
  reducerPath: "transactionAdminAPI",
  baseQuery: baseQuery,
  tagTypes: ["VirtualEstatesAdmin"],
  endpoints: (builder) => ({
    getTransactions: builder.query<
      {
        transactions: VirtualEstateTransactionRecord[];
        totalCount: number;
      },
      {
        page: number;
        size: number;
      }
    >({
      query: ({ page = 1, size = 20 }) => ({
        url: `/admin/transactions?page=${page}&size=${size}`,
        method: "GET",
      }),
      // providesTags: ["VirtualEstatesAdmin"],
      transformResponse: (response: {
        transactions: VirtualEstateTransactionRecord[];
        totalCount: number;
      }) => {
        return {
          transactions: response.transactions,
          totalCount: response.totalCount,
        };
      },
    }),
  }),
});
export const { useGetTransactionsQuery } = transactionAdminAPI;
