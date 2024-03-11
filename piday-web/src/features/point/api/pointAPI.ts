import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQuery } from "../../rtk-utils/fetch-base-query";
import { PointRecord } from "../interface/point.interface";

export const pointRTKApi = createApi({
  reducerPath: "pointAPI",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getMyPoint: builder.query<number, void>({
      query: () => ({
        url: `/point`,
        method: "GET",
      }),
      transformResponse: (response: { point: number }) => {
        return response.point;
      },
    }),
    checkIn: builder.mutation<void, void>({
      query: () => ({
        url: `/point/check-in`,
        method: "POST",
      }),
    }),
    getPointRecords: builder.query<
      {
        pointRecords: PointRecord[];
        totalCount: number;
      },
      {
        page: number;
        size: number;
      }
    >({
      query: ({ page, size }) => ({
        url: `/point/records?page=${page}&size=${size}`,
        method: "GET",
      }),
      transformResponse: (response: {
        pointRecords: PointRecord[];
        totalCount: number;
      }) => {
        return response;
      },
    }),
    getMyPointInfo: builder.query<
      {
        checkedInToday: boolean;
      },
      void
    >({
      query: () => ({
        url: `/point/info`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetMyPointQuery,
  useCheckInMutation,
  useGetPointRecordsQuery,
  useGetMyPointInfoQuery,
} = pointRTKApi;
