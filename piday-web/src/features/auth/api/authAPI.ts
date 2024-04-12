import { createApi } from "@reduxjs/toolkit/query/react";
import { AxiosResponse } from "axios";

import { baseQuery } from "../../rtk-utils/fetch-base-query";
import { User } from "../interface/User.interface";

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

    // Pi Sign In
    piSignIn: builder.mutation<
      void,
      {
        accessToken: string;
      }
    >({
      query: ({ accessToken }) => ({
        url: `/auth/pi-sign-in`,
        method: "POST",
        body: {
          accessToken,
        },
      }),
    }),

    getMyUser: builder.query<User, void>({
      query: () => ({
        url: `/user`,
        method: "GET",
      }),
      transformResponse: (response: { user: User }) => {
        return response.user;
      },
    }),

    setPaymentPassword: builder.mutation<
      void,
      {
        password: string;
        confirmPassword: string;
      }
    >({
      query: ({ password, confirmPassword }) => ({
        url: `/auth/payment-password`,
        method: "POST",
        body: {
          password,
          confirmPassword,
        },
      }),
    }),
    resetAccountPassword: builder.mutation<
      void,
      {
        code: string;
        email: string;
        confirmPassword: string;
        newPassword: string;
      }
    >({
      query: ({ code, email, confirmPassword, newPassword }) => ({
        url: `/auth/reset-password`,
        method: "POST",
        body: {
          code,
          email,
          confirmPassword,
          newPassword,
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
    sendPasswordResetEmail: builder.mutation<
      void,
      { email: string; locale: string }
    >({
      query: ({ email, locale }: { email: string; locale: string }) => ({
        url: `/auth/send-password-reset-email?email=${email}`,
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

export const {
  useEmailSignUpMutation,
  useSendEmailVerificationMutation,

  usePiSignInMutation,
  useGetMyUserQuery,
  useLazyGetMyUserQuery,

  useSetPaymentPasswordMutation,
  useResetAccountPasswordMutation,
} = authRTKApi;
