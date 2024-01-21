import instance from "@/src/features/axios/instance";
import { AxiosError } from "axios";
import { StatusCodes } from "http-status-codes";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  
) {
  const searchParams = request.nextUrl.searchParams;
  const { headers } = request;
  const email = searchParams.get("email");
  const userID = searchParams.get("userID");
  const walletAddress = searchParams.get("walletAddress");
  try {
    const res = await instance.get(`/user/info?email=${email}&userID=${userID}&walletAddress=${walletAddress}`);

    return new Response(JSON.stringify(res.data), {
      status: StatusCodes.OK,
    });
  } catch (error) {
    console.error("Error in user info " , error);
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
