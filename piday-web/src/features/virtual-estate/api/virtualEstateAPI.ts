import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQuery } from "../../rtk-utils/fetch-base-query";
import { VirtualEstate } from "../interface/virtual-estate.interface";

export const virtualEstateRTKApi = createApi({
  reducerPath: "virtualEstateAPI",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getOneVirtualEstate: builder.query<VirtualEstate, { hexID: string }>({
      query: ({ hexID }) => ({
        url: `/virtual-estate/${hexID}`,
        method: "GET",
      }),
      transformResponse: (response: { ve: VirtualEstate }) => {
        return response?.ve;
      },
    }),

    mintOneVirtualEstate: builder.mutation<VirtualEstate, { hexID: string }>({
      query: ({ hexID }) => ({
        url: `/virtual-estate/${hexID}`,
        method: "POST",
        body: {},
      }),
      transformResponse: (response: { ve: VirtualEstate }) => {
        return response?.ve;
      },
    }),
  }),
});

export const { useGetOneVirtualEstateQuery, useMintOneVirtualEstateMutation } =
  virtualEstateRTKApi;
