import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQuery } from "../../rtk-utils/fetch-base-query";

export const mapboxRTKApi = createApi({
  reducerPath: "mapboxAPI",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getPlaces: builder.query({
      query: ({ lng, lat }) => ({
        url: `/map/places?lng=${lng}&lat=${lat}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetPlacesQuery } = mapboxRTKApi;
