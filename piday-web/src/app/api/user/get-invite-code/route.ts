import { HeaderFilters } from "@/src/features/axios/header-filters";
import instance from "@/src/features/axios/instance";
import { AxiosError } from "axios";
import { StatusCodes } from "http-status-codes";

export async function GET(request: Request) {
  try {
    const { headers } = request;
    const res = await instance.get(`/user/get-invite-code`, {
      headers: HeaderFilters(headers),
    });

    return new Response(JSON.stringify(res.data), {
      status: StatusCodes.OK,
    });
  } catch (error) {
    console.error("Error in user info ", error);
    const axiosError = error as AxiosError;

    return new Response(
      JSON.stringify({
        success: false,
        message: "Fail to get user info user",
        error: axiosError.response?.data || "Unknown error",
      }),
      {
        status:
          axiosError.response?.status || StatusCodes.INTERNAL_SERVER_ERROR,
      },
    );
  }
}
