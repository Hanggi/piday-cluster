import instance from "@/src/features/axios/instance";
import { AxiosError } from "axios";
import { StatusCodes } from "http-status-codes";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ hexID: string }>;
  },
) {
  const hexID = (await params).hexID;

  try {
    const res = await instance.get("/virtual-estates/" + hexID + "/in-area");

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
