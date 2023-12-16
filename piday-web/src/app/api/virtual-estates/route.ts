import { HeaderFilters } from "@/src/features/axios/header-filters";
import instance from "@/src/features/axios/instance";
import { AxiosError } from "axios";
import { StatusCodes } from "http-status-codes";

import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params, body }: { params: { page: string; pageSize: string }; body: {} },
) {
  const searchParams = request.nextUrl.searchParams;
  const { headers } = request;
  const page = searchParams.get("page");
  const size = searchParams.get("size");
  try {
    console.log("Getting it here ");
    const res = await instance.get(
      `/virtual-estate/all?page=${page}&size=${size}`,
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
