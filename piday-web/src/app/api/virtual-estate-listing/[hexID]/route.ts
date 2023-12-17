import { HeaderFilters } from "@/src/features/axios/header-filters";
import instance from "@/src/features/axios/instance";
import { TransactionType } from "@/src/utils/types";
import { AxiosError } from "axios";
import { StatusCodes } from "http-status-codes";

export async function POST(
  request: Request,
  {
    params,
    body,
  }: {
    params: { hexID: string };
    body: { price: number; type: TransactionType; expiresAt: Date };
  },
) {
  const { headers } = request;
  const hexID = params.hexID;
  const { price, type, expiresAt } = body;
  try {
    const res = await instance.post(
      "/virtual-estate-listing/" + hexID + "/bid",
      { price, type, expiresAt },
      {
        headers: HeaderFilters(headers),
      },
    );

    return new Response(JSON.stringify(res.data), {
      status: StatusCodes.OK,
    });
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("Fail to bid on virtual estate!!", axiosError);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Fail to bid on virtual estate",
      }),
      {
        status:
          axiosError.response?.status || StatusCodes.INTERNAL_SERVER_ERROR,
      },
    );
  }
}
