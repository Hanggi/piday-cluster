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
    const axiosRes = await instance.get(
      `/auth/send-password-update-email?email=${email}`,
    );

    if (axiosRes.status == StatusCodes.OK) {
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
      return new Response(
        JSON.stringify({
          success: false,
          message: "Password update email not sent",
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

    console.error("Send password update email!!", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Send password update email failed",
      }),
      {
        status:
          axiosError.response?.status || StatusCodes.INTERNAL_SERVER_ERROR,
      },
    );
  }
}
