import { fetchBaseQuery } from "@reduxjs/toolkit/query";

export const baseQuery = fetchBaseQuery({
  //   baseUrl: process.env.BACKEND_BASE_URL,
  baseUrl: "/api",
});
