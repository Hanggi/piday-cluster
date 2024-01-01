import { createApi } from "@reduxjs/toolkit/query/react";

import { User } from "../../auth/interface/User.interface";
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
      transformResponse: (res: any) => {
        return res.balance;
      },
    }),
    getMyRechargeRecords: builder.query<
      {
        records: RechargeRecordInterface[];
        totalCount: number;
      },
      { page: number; size: number }
    >({
      query: ({ page, size }) => ({
        url: `/account/balance/records?page=${page}&size=${size}`,
        method: "GET",
      }),

      transformResponse: (response: {
        records: RechargeRecordInterface[];
        totalCount: number;
      }) => {
        return { records: response.records, totalCount: response.totalCount };
      },
    }),
    updateMyPiWalletAddress: builder.mutation<
      User,
      { piWalletAddress: string }
    >({
      query: ({ piWalletAddress }) => ({
        url: "/account/pi-address",
        method: "PUT",
        body: { piWalletAddress },
      }),
      transformResponse: (response: { user: User }) => {
        return response?.user;
      },
      transformErrorResponse: (error: any) => {
        console.log(error);
        return error.data;
      },
    }),
  }),
});

export const {
  useGetBalanceQuery,
  useGetMyRechargeRecordsQuery,
  useUpdateMyPiWalletAddressMutation,
} = accountRTKApi;
