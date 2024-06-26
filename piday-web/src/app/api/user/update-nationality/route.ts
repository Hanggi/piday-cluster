import { HeaderFilters } from "@/src/features/axios/header-filters";
import instance from "@/src/features/axios/instance";
import { AxiosError } from "axios";
import { StatusCodes } from "http-status-codes";

import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { headers } = request;

    const body = await request.json();
    const { nationality } = body;
    const res = await instance.post(
      `/user/update-nationality`,
      { nationality },
      {
        headers: HeaderFilters(headers),
      },
    );

    return new Response(JSON.stringify(res.data), {
      status: StatusCodes.OK,
    });
  } catch (error) {
    console.error("Error in user info ", error);
    const axiosError = error as AxiosError;

    return new Response(
      JSON.stringify({
        success: false,
        message: "Fail to get user info user",
        error: axiosError.response?.data || "Unknown error",
      }),
      {
        status:
          axiosError.response?.status || StatusCodes.INTERNAL_SERVER_ERROR,
      },
    );
  }
}
