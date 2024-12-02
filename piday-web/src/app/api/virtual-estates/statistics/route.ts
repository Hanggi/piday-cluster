import instance from "@/src/features/axios/instance";
import { AxiosError } from "axios";
import { StatusCodes } from "http-status-codes";

import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params, body }: { params: Promise<{ side: string }>; body: {} },
) {
  try {
    const res = await instance.get(`/virtual-estates/statistics`, {});

    return new Response(JSON.stringify(res.data), {
      status: StatusCodes.OK,
    });
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(
      "Fail to get virtual estates transaction records for user!!",
      axiosError,
    );

    return new Response(
      JSON.stringify({
        success: false,
        message: "Fail to get virtual estates transaction records for user",
      }),
      {
        status:
          axiosError.response?.status || StatusCodes.INTERNAL_SERVER_ERROR,
      },
    );
  }
}
