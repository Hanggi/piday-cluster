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
    getInviteCode: builder.query<string, void>({
      query: () => ({
        url: `/user/get-invite-code`,
        method: "GET",
      }),
      transformResponse: (response: { inviteCode: string }) => {
        return response.inviteCode;
      },
    }),
    updateUserNationality: builder.mutation<boolean, { nationality: string }>({
      query: ({ nationality }) => ({
        url: `user/update-nationality`,
        method: "POST",
        body: { nationality },
      }),
      transformResponse: (response: { success: boolean }) => {
        return response.success;
      },
    }),
  }),
});

export const {
  useGetUserInfoQuery,
  useLazyGetUserInfoQuery,
  useGetInviteCodeQuery,
  useUpdateUserNationalityMutation,
} = userRTKAPI;
