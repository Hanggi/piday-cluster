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
  }),
});
export const { useGetUsersQuery } = userAdminAPI;
