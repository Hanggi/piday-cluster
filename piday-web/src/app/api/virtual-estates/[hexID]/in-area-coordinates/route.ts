import instance from "@/src/features/axios/instance";
import { AxiosError } from "axios";
import { StatusCodes } from "http-status-codes";

import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { hexID: string } },
) {
  const hexID = params.hexID;

  const searchParams = request.nextUrl.searchParams;
  const zoom = searchParams.get("zoom");
  try {
    const res = await instance.get(
      "/virtual-estates/" + hexID + `/in-area-coordinates?zoom=${zoom}`,
    );

    return new Response(JSON.stringify(res.data), {
      status: StatusCodes.OK,
    });
  } catch (error) {
    const axiosError = error as AxiosError;

    console.error(
      "Fail to get virtual estate status in area",
      axiosError.response?.status,
      axiosError?.response?.data,
    );
    if (axiosError.response?.status === StatusCodes.NOT_FOUND) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "virtual estate not found in area",
        }),
        {
          status: StatusCodes.NOT_FOUND,
        },
      );
    }

    return new Response(
      JSON.stringify({
        success: false,
        message: "Fail to get virtual estate status in area",
      }),
      {
        status:
          axiosError.response?.status || StatusCodes.INTERNAL_SERVER_ERROR,
      },
    );
  }
}
