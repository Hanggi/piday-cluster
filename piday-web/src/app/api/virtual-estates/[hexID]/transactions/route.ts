import instance from "@/src/features/axios/instance";
import { AxiosError } from "axios";
import { StatusCodes } from "http-status-codes";

import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ hexID: string }>;
  },
) {
  const hexID = (await params).hexID;

  const searchParams = request.nextUrl.searchParams;
  const { headers } = request;
  const page = searchParams.get("page");
  const size = searchParams.get("size");
  try {
    const res = await instance.get(
      `/virtual-estates/${hexID}/transactions?page=${page}&size=${size}`,
    );

    return new Response(JSON.stringify(res.data), {
      status: StatusCodes.OK,
    });
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(
      "Fail to get transactions for virtual estate!!",
      axiosError.response?.status,
      axiosError?.response?.data,
    );

    if (axiosError.response?.status === StatusCodes.NOT_FOUND) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Transactions for virtual estate not found",
        }),
        {
          status: StatusCodes.NOT_FOUND,
        },
      );
    }

    return new Response(
      JSON.stringify({
        success: false,
        message: "Fail to get transactions for virtual estate",
      }),
      {
        status:
          axiosError.response?.status || StatusCodes.INTERNAL_SERVER_ERROR,
      },
    );
  }
}
