import { createApi } from "@reduxjs/toolkit/query/react";
import { AxiosResponse } from "axios";

import { baseQuery } from "../../rtk-utils/fetch-base-query";

export const authRTKApi = createApi({
  reducerPath: "authAPI",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    emailSignUp: builder.mutation({
      query: (body) => ({
        url: `/auth/register`,
        method: "POST",
        body,
      }),
    }),
    sendEmailVerification: builder.mutation<
      void,
      { email: string; locale: string }
    >({
      query: ({ email, locale }: { email: string; locale: string }) => ({
        url: `/auth/send-email-verification?email=${email}`,
        method: "GET",
        headers: {
          locale,
        },
      }),
      transformResponse: (response: AxiosResponse) => {
        return response.data;
      },
      transformErrorResponse: (error: any) => {
        console.log(error);
        return error.data;
      },
    }),
  }),
});

export const { useEmailSignUpMutation, useSendEmailVerificationMutation } =
  authRTKApi;
