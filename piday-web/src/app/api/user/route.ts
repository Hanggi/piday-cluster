import { HeaderFilters } from "@/src/features/axios/header-filters";
import instance from "@/src/features/axios/instance";
import { AxiosError } from "axios";
import { StatusCodes } from "http-status-codes";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: { hexID: string; bidID: string };
  },
) {
  const { headers } = request;

  try {
    const res = await instance.get("/user", {
      headers: HeaderFilters(headers),
    });

    return new Response(JSON.stringify(res.data), {
      status: StatusCodes.OK,
    });
  } catch (error) {
    console.error(error);
    const axiosError = error as AxiosError;

    return new Response(
      JSON.stringify({
        success: false,
        message: "Fail to get my user",
        error: axiosError.response?.data || "Unknown error",
      }),
      {
        status:
          axiosError.response?.status || StatusCodes.INTERNAL_SERVER_ERROR,
      },
    );
  }
}
