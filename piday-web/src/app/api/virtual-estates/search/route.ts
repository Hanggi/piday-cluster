import instance from "@/src/features/axios/instance";
import { AxiosError } from "axios";
import { StatusCodes } from "http-status-codes";

import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const page = searchParams.get("page");
  const size = searchParams.get("size");
  const name = searchParams.get("name");

  try {
    const res = await instance.get(
      `/virtual-estates/search?page=${page}&size=${size}&name=${name}`,
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
