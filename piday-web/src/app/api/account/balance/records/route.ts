import { HeaderFilters } from "@/src/features/axios/header-filters";
import instance from "@/src/features/axios/instance";
import { StatusCodes } from "http-status-codes";

import { NextRequest } from "next/server";
export async function GET(request: NextRequest) {
  const { headers } = request;

  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get("page");
  const size = searchParams.get("size");
  try {
    const res = await instance.get(`/account/balance/records?page=${page}&size=${size}`, {
      headers: HeaderFilters(headers),
    });

    return new Response(
      JSON.stringify({
        message: "Get all recharge records",
        data: res.data.rechargeRecords,
      }),
      {
        status: StatusCodes.OK,
      },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        message: "Get recharge records failed.",
        data: err,
      }),
      {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      },
    );
  }
}
