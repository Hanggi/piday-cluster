import initTranslations from "@/src/app/i18n";
import instance from "@/src/features/axios/instance";
import { AxiosError } from "axios";
import { StatusCodes } from "http-status-codes";

import { NextRequest } from "next/server";

export async function GET(request: NextRequest, res: Response) {
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get("email");

  const { t, options } = await initTranslations("en", ["common"]);

  try {
    const fetchRes = await instance.get(
      `/auth/send-email-verification?email=${email}`,
    );

    if (fetchRes.status == StatusCodes.OK) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "Email sent",
        }),
        {
          status: StatusCodes.OK,
        },
      );
    } else {
      if (fetchRes.status == StatusCodes.CONFLICT) {
        return new Response(
          JSON.stringify({
            success: false,
            message: t("common:auth.errors.emailAlreadyExists"),
          }),
          {
            status: StatusCodes.CONFLICT,
          },
        );
      } else if (fetchRes.status == StatusCodes.BAD_REQUEST) {
        return new Response(
          JSON.stringify({
            success: false,
            message: t("common:auth.errors.invalidEmail"),
          }),
          {
            status: StatusCodes.BAD_REQUEST,
          },
        );
      } else if (fetchRes.status == StatusCodes.TOO_MANY_REQUESTS) {
        return new Response(
          JSON.stringify({
            success: false,
            message: t("common:auth.errors.tooManyRequests"),
          }),
          {
            status: StatusCodes.TOO_MANY_REQUESTS,
          },
        );
      }

      return new Response(
        JSON.stringify({
          success: false,
          message: "Verification not sent",
        }),
        {
          status: StatusCodes.INTERNAL_SERVER_ERROR,
        },
      );
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("Send verification email!!", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Send verification email failed",
      }),
      {
        status: axiosError.response?.status,
      },
    );
  }
}
