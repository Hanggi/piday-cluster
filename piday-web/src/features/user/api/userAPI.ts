import { createApi } from "@reduxjs/toolkit/query/react";
import { User } from "next-auth";

import { baseQuery } from "../../rtk-utils/fetch-base-query";

export const userRTKAPI = createApi({
  reducerPath: "userAPI",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getUserInfo: builder.query<
      User,
      { email?: string; userID?: string; walletAddress?: string }
    >({
      query: ({ email, userID, walletAddress }) => ({
        url: `/user/info?email=${email}&userID=${userID}&walletAddress=${walletAddress}`,
        method: "GET",
      }),
      transformResponse: (response: { user: User }) => {
        return response.user;
      },
    }),
  }),
});

export const { useGetUserInfoQuery, useLazyGetUserInfoQuery } = userRTKAPI;
