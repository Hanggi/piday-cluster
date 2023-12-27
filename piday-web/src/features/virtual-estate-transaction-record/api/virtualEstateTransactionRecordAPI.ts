import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQuery } from "../../rtk-utils/fetch-base-query";
import { VirtualEstateTransactionRecordInterface } from "../interface/virtual-estate-transaction-record-interface";

export const virtualEstateTransactionRecordsRTKApi = createApi({
  reducerPath: "virtualEstateTransactionRecordsApi",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getAllTransactionRecordsForUser: builder.query<
      VirtualEstateTransactionRecordInterface[],
      { side: string;  }
    >({
      query: ({ side }) => ({
        url: `/virtual-estate/transaction?side=${side}`,
        method: "GET",
      }),
      transformResponse: (response: { transactionRecords: VirtualEstateTransactionRecordInterface[] }) => {
        return response?.transactionRecords;
      },
    }),
  }),
});

export const { useGetAllTransactionRecordsForUserQuery } =
virtualEstateTransactionRecordsRTKApi;
