import initTranslations from "@/src/app/i18n";
import { StatusCodes } from "http-status-codes";

import { NextRequest } from "next/server";

export async function GET(request: NextRequest, res: Response) {
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get("email");


  const { t, options } = await initTranslations("en", ["common"]);

  try {
    const fetchRes = await fetch(
      `${process.env.BACKEND_BASE_URL}/auth/send-email-verification?email=${email}`,
    );
    
    if (fetchRes.ok) {
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
    console.error("User registration failed!!", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "User registration failed",
      }),
      {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      },
    );
  }
}
