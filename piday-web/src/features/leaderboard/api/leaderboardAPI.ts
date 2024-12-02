import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQuery } from "../../rtk-utils/fetch-base-query";

export const leaderboardAPI = createApi({
  reducerPath: "leaderboardAPI",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getInvitationRank: builder.query<any, { page: number; size: number }>({
      query: ({ page, size }) => ({
        url: `/leaderboard/invitation-rank?page=${page}&size=${size}`,
        method: "GET",
      }),
      transformResponse: (res: any) => {
        return res;
      },
    }),
    getCommissionRank: builder.query<any, { page: number; size: number }>({
      query: ({ page, size }) => ({
        url: `/leaderboard/commission-rank?page=${page}&size=${size}`,
        method: "GET",
      }),
      transformResponse: (res: any) => {
        return res;
      },
    }),
    getPointsRank: builder.query<any, { page: number; size: number }>({
      query: ({ page, size }) => ({
        url: `/leaderboard/points-rank?page=${page}&size=${size}`,
        method: "GET",
      }),
      transformResponse: (res: any) => {
        return res;
      },
    }),
  }),
});

export const {
  useGetInvitationRankQuery,
  useGetCommissionRankQuery,
  useGetPointsRankQuery,
} = leaderboardAPI;
