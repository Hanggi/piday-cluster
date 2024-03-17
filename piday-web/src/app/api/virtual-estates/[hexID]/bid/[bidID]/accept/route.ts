import { HeaderFilters } from "@/src/features/axios/header-filters";
import instance from "@/src/features/axios/instance";
import { AxiosError } from "axios";
import { StatusCodes } from "http-status-codes";

export async function PATCH(
  request: Request,
  {
    params,
  }: {
    params: { hexID: string; bidID: string };
  },
) {
  const { headers } = request;
  const hexID = params.hexID;
  const bidID = params.bidID;

  const req = await request.json();

  try {
    const res = await instance.patch(
      "/virtual-estates/" + hexID + "/bid/" + bidID + "/accept",
      {
        ...req,
      },
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
