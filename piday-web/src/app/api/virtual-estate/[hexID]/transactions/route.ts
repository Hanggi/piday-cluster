import { HeaderFilters } from "@/src/features/axios/header-filters";
import instance from "@/src/features/axios/instance";
import { AxiosError } from "axios";
import { StatusCodes } from "http-status-codes";

export async function GET(
  request: Request,
  { params }: { params: { hexID: string } },
) {
  const hexID = params.hexID;

  try {
    const res = await instance.get(
      "/virtual-estates/" + hexID + "/transactions",
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
