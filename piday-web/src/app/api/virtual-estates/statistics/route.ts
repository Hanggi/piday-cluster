import { HeaderFilters } from "@/src/features/axios/header-filters";
import instance from "@/src/features/axios/instance";
import { AxiosError } from "axios";
import { StatusCodes } from "http-status-codes";

import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const { headers } = request;
  const totalMinted = searchParams.get("totalMinted");
  const listings = searchParams.get("listings");
  const transactionVolume = searchParams.get("transactionVolume");
  const transactionCount = searchParams.get("transactionCount");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  try {
    const res = await instance.get(
      `/virtual-estates/statistics?totalMinted=${totalMinted}&listings=${listings}&transactionVolume=${transactionVolume}&transactionCount=${transactionCount}&startDate=${startDate}&endDate=${endDate}`,
      {
        headers: HeaderFilters(headers),
      },
    );

    return new Response(JSON.stringify(res.data), {
      status: StatusCodes.OK,
    });
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("Fail to get virtual estates statistics!!", axiosError);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Fail to get virtual estates statistics",
      }),
      {
        status:
          axiosError.response?.status || StatusCodes.INTERNAL_SERVER_ERROR,
      },
    );
  }
}
