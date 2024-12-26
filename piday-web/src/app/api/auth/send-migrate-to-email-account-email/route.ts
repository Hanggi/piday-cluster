import initTranslations from "@/src/app/i18n";
import instance from "@/src/features/axios/instance";
import { AxiosError } from "axios";
import { StatusCodes } from "http-status-codes";

import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userID = searchParams.get("userID");
  const email = searchParams.get("email");

  console.log("userID", userID, email);

  const { t, options } = await initTranslations("en", ["common"]);

  try {
    const axiosRes = await instance.get(
      `/auth/send-migrate-to-email-account-email?userID=${userID}&email=${email}`,
    );

    if (axiosRes.status == StatusCodes.OK) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "Migration email sent",
        }),
        {
          status: StatusCodes.OK,
        },
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Migration email failed",
        }),
        {
          status: StatusCodes.INTERNAL_SERVER_ERROR,
        },
      );
    }
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.response?.status == StatusCodes.NOT_FOUND) {
      return new Response(
        JSON.stringify({
          success: false,
          message: t("common:auth.errors.userNotFound"),
        }),
        {
          status: StatusCodes.CONFLICT,
        },
      );
    }

    console.error("Migration email filed!", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Migration email failed",
      }),
      {
        status:
          axiosError.response?.status || StatusCodes.INTERNAL_SERVER_ERROR,
      },
    );
  }
}
