import { createApi } from "@reduxjs/toolkit/query/react";

import { User } from "../../auth/interface/User.interface";
import { baseQuery } from "../../rtk-utils/fetch-base-query";
import { WithdrawRequest } from "../interface/withdraw-request.interface";

export const withdrawRequestRTKApi = createApi({
  reducerPath: "withdrawRequestAPI",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    createWithdrawRequest: builder.mutation<
      WithdrawRequest,
      { amount: string }
    >({
      query: ({ amount }) => ({
        url: "/withdraw/create",
        method: "POST",
        body: { amount },
      }),
      transformResponse: (response: { withdrawRequest: WithdrawRequest }) => {
        return response?.withdrawRequest;
      },
      transformErrorResponse: (error: any) => {
        console.log(error);
        return error.data;
      },
    }),
    cancelWithdrawRequest: builder.mutation<
      WithdrawRequest,
      { withdrawStatusID: string }
    >({
      query: ({ withdrawStatusID }) => ({
        url: "/withdraw/cancel",
        method: "POST",
        body: { withdrawStatusID },
      }),
      transformResponse: (response: { withdrawRequest: WithdrawRequest }) => {
        return response?.withdrawRequest;
      },
      transformErrorResponse: (error: any) => {
        console.log(error);
        return error.data;
      },
    }),
  }),
});

export const {
  useCreateWithdrawRequestMutation,
  useCancelWithdrawRequestMutation,
} = withdrawRequestRTKApi;
