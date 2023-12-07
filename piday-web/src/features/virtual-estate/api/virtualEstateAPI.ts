import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQuery } from "../../rtk-utils/fetch-base-query";

export const virtualEstateRTKApi = createApi({
  reducerPath: "virtualEstateAPI",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getOneVirtualEstate: builder.query({
      query: ({ hexID }) => ({
        url: `/virtual-estate/${hexID}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.ve;
      },
    }),
  }),
});

export const { useGetOneVirtualEstateQuery } = virtualEstateRTKApi;
