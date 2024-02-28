import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQuery } from "../../rtk-utils/fetch-base-query";
import { VirtualEstate } from "../../virtual-estate/interface/virtual-estate.interface";

export const virtualEstatesAdminAPI = createApi({
  reducerPath: "virtualEstatesAdminAPI",
  baseQuery: baseQuery,
  tagTypes: ["VirtualEstatesAdmin"],
  endpoints: (builder) => ({
    getVirtualEstates: builder.query<
      {
        virtualEstates: VirtualEstate[];
        totalCount: number;
      },
      {
        page: number;
        size: number;
      }
    >({
      query: ({ page = 1, size = 20 }) => ({
        url: `/admin/virtual-estates?page=${page}&size=${size}`,
        method: "GET",
      }),
      // providesTags: ["VirtualEstatesAdmin"],
      transformResponse: (response: {
        virtualEstates: VirtualEstate[];
        totalCount: number;
      }) => {
        return {
          virtualEstates: response.virtualEstates,
          totalCount: response.totalCount,
        };
      },
    }),
  }),
});
export const { useGetVirtualEstatesQuery } = virtualEstatesAdminAPI;
