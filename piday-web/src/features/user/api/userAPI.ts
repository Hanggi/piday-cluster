import { createApi } from "@reduxjs/toolkit/query/react";

import { User } from "../../auth/interface/User.interface";
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
        url: `/user/info`,
        method: "GET",
        params: { email, userID, walletAddress },
      }),
      transformResponse: (response: { user: User }) => {
        return response.user;
      },
    }),
  }),
});

export const { useGetUserInfoQuery, useLazyGetUserInfoQuery } = userRTKAPI;
