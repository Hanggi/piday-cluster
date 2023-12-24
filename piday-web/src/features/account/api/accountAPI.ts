import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQuery } from "../../rtk-utils/fetch-base-query";
import { RechargeRecordInterface } from "../interface/recharge-record.interface";

export const accountRTKApi = createApi({
  reducerPath: "accountAPI",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getBalance: builder.query({
      query: () => ({
        url: `/account/balance`,
        method: "GET",
      }),
    }),
    getAllRechargeRecords: builder.query<
      RechargeRecordInterface[],
      { page: string; size: string }
    >({
      query: ({ page, size }) => ({
        url: `/account/balance/records?page=${page}&size=${size}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetBalanceQuery, useGetAllRechargeRecordsQuery } =
  accountRTKApi;
