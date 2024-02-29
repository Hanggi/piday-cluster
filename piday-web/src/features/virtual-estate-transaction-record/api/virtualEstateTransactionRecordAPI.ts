import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQuery } from "../../rtk-utils/fetch-base-query";
import { VirtualEstateTransactionRecord } from "../interface/virtual-estate-transaction-record-interface";

export const virtualEstateTransactionRecordsRTKApi = createApi({
  reducerPath: "virtualEstateTransactionRecordsApi",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getAllTransactionRecordsForUser: builder.query<
      VirtualEstateTransactionRecord[],
      { side: string }
    >({
      query: ({ side }) => ({
        url: `/virtual-estates/transaction?side=${side}`,
        method: "GET",
      }),
      transformResponse: (response: {
        transactionRecords: VirtualEstateTransactionRecord[];
      }) => {
        return response?.transactionRecords;
      },
    }),
  }),
});

export const { useGetAllTransactionRecordsForUserQuery } =
  virtualEstateTransactionRecordsRTKApi;
