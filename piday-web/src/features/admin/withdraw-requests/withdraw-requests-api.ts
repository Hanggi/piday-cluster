import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQuery } from "../../rtk-utils/fetch-base-query";
import { VirtualEstate } from "../../virtual-estate/interface/virtual-estate.interface";
import { WithdrawRequest } from "../../withdraw/interface/withdraw-request.interface";

export const withdrawRequestAdminAPI = createApi({
  reducerPath: "withdrawRequestAdminAPI",
  baseQuery: baseQuery,
  tagTypes: ["WithdrawRequestAdmin"],
  endpoints: (builder) => ({
    getWithdrawRequests: builder.query<
      {
        withdrawRequests: WithdrawRequest[];
        totalCount: number;
      },
      {
        page: number;
        size: number;
      }
    >({
      query: ({ page = 1, size = 20 }) => ({
        url: `/admin/withdraw-request?page=${page}&size=${size}`,
        method: "GET",
      }),
      // providesTags: ["VirtualEstatesAdmin"],
      transformResponse: (response: {
        withdrawRequests: WithdrawRequest[];
        totalCount: number;
      }) => {
        return {
          withdrawRequests: response.withdrawRequests,
          totalCount: response.totalCount,
        };
      },
    }),

    acceptWithdrawRequest: builder.mutation<
      {
        success: boolean;
        res: any;
      },
      { withdrawStatusID: string }
    >({
      query: ({ withdrawStatusID }) => ({
        url: `admin/withdraw-request/accept`,
        body: { withdrawStatusID },
        method: "POST",
      }),
    }),
    cancelWithdrawRequest: builder.mutation<
      { success: boolean; res: any },
      { withdrawStatusID: string }
    >({
      query: ({ withdrawStatusID }) => ({
        url: `admin/withdraw-request/cancel`,
        body: { withdrawStatusID },
        method: "POST",
      }),
    }),
  }),
});
export const {
  useGetWithdrawRequestsQuery,
  useAcceptWithdrawRequestMutation,
  useCancelWithdrawRequestMutation,
} = withdrawRequestAdminAPI;
