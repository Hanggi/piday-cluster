import { createApi } from "@reduxjs/toolkit/query/react";

import { User } from "../../auth/interface/User.interface";
import { baseQuery } from "../../rtk-utils/fetch-base-query";

export const userAdminAPI = createApi({
  reducerPath: "userAdminAPI",
  baseQuery: baseQuery,
  tagTypes: ["UserAdmin"],
  endpoints: (builder) => ({
    getUsers: builder.query<
      {
        users: User[];
        totalCount: number;
      },
      {
        page: number;
        size: number;
        withBalance?: boolean;
      }
    >({
      query: ({ page = 1, size = 20, withBalance = true }) => ({
        url: `/admin/users?page=${page}&size=${size}&withBalance=${withBalance}`,
        method: "GET",
      }),
      // providesTags: ["VirtualEstatesAdmin"],
      transformResponse: (response: { users: User[]; totalCount: number }) => {
        return {
          users: response.users,
          totalCount: response.totalCount,
        };
      },
    }),

    // General ledger
    getGeneralLedger: builder.query<
      {
        generalBalance: number;
        totalUsers: number;
        totalTransactions: number;
        totalVirtualEstates: number;
        totalTransactionAmount: number;

        inviteCode: string;
      },
      void
    >({
      query: () => ({
        url: `/admin/users/general-ledger`,
        method: "GET",
      }),
      transformResponse: (response: any) => {
        return response.ledger;
      },
    }),

    getLedgerRecords: builder.query<
      {
        records: any[];
        totalCount: number;
      },
      {
        page: number;
        size: number;
      }
    >({
      query: ({ page = 1, size = 20 }) => ({
        url: `/admin/users/ledger-records?page=${page}&size=${size}`,
        method: "GET",
      }),
      transformResponse: (response: any) => {
        return {
          records: response.records,
          totalCount: response.totalCount,
        };
      },
    }),
  }),
});
export const {
  useGetUsersQuery,
  useGetGeneralLedgerQuery,
  useGetLedgerRecordsQuery,
} = userAdminAPI;
