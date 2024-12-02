import { AxiosError } from "axios";
import { StatusCodes } from "http-status-codes";

import { NextRequest } from "next/server";

import { HeaderFilters } from "../../../../features/axios/header-filters";
import instance from "../../../../features/axios/instance";

export async function GET(
  request: NextRequest,
  segmentData: {
    params: Promise<{ page: string; size: string }>;
    body: {};
  },
) {
  const searchParams = await segmentData.params;
  const { headers } = request;

  const page = searchParams.page;
  const size = searchParams.size;

  try {
    const res = await instance.get(
      `/leaderboard/points-rank?page=${page}&size=${size}`,
      {
        headers: HeaderFilters(headers),
      },
    );

    return new Response(JSON.stringify(res.data), {
      status: StatusCodes.OK,
    });
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("Fail to get virtual estates for user!!", axiosError);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Fail to get virtual estates for user",
      }),
      {
        status:
          axiosError.response?.status || StatusCodes.INTERNAL_SERVER_ERROR,
      },
    );
  }
}
