import { HeaderFilters } from "@/src/features/axios/header-filters";
import instance from "@/src/features/axios/instance";
import { AxiosError } from "axios";
import { StatusCodes } from "http-status-codes";

export async function POST(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ hexID: string; bidID: string }>;
  },
) {
  const body = await request.json();
  const { receiverID, paymentPassword } = body;
  const { headers } = request;
  const hexID = (await params).hexID;

  try {
    const res = await instance.post(
      "/virtual-estates/" + hexID + "/transfer",
      { receiverID, paymentPassword },
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
        message: "Fail to transfer virtual estate",
        error: axiosError.response?.data || "Unknown error",
      }),
      {
        status:
          axiosError.response?.status || StatusCodes.INTERNAL_SERVER_ERROR,
      },
    );
  }
}
