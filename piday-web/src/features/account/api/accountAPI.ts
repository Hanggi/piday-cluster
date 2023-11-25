import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQuery } from "../../rtk-utils/fetch-base-query";

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
  }),
});

export const { useGetBalanceQuery } = accountRTKApi;
