import { HeaderFilters } from "@/src/features/axios/header-filters";
import instance from "@/src/features/axios/instance";
import { decrypt } from "@/src/utils/encryption";
import { AxiosError } from "axios";
import { StatusCodes } from "http-status-codes";

import { NextRequest } from "next/server";

export async function POST(
  request: NextRequest,
  {
    params,
  }: {
    params: { hexID: string; bidID: string };
  },
) {
  console.log("All route! /account/balance/transfer!");
  const { headers } = request;

  console.log(request.body);
  try {
    const res = await instance.post(
      "/account/balance/transfer",
      { ...(await request.json()) },
      {
        headers: HeaderFilters(headers),
      },
    );

    return new Response(JSON.stringify(res.data), {
      status: StatusCodes.OK,
    });
  } catch (error) {
    const axiosError = error as AxiosError;
    return new Response(
      JSON.stringify({
        success: false,
        message: "Fail to sell virtual estate",
        error: axiosError.response?.data || "Unknown error",
      }),
      {
        status:
          axiosError.response?.status || StatusCodes.INTERNAL_SERVER_ERROR,
      },
    );
  }
}
