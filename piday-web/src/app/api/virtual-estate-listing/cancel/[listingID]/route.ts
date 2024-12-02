import { HeaderFilters } from "@/src/features/axios/header-filters";
import instance from "@/src/features/axios/instance";
import { AxiosError } from "axios";
import { StatusCodes } from "http-status-codes";

export async function POST(
  request: Request,

  {
    params,
  }: {
    params: Promise<{ listingID: string }>;
  },
) {
  const { headers } = request;
  const listingID = (await params).listingID;
  try {
    const res = await instance.post(
      "/virtual-estate-listing/cancel/" + listingID,
      {},
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
        message: "Fail to cancel virtual estate listing",
        error: axiosError.response?.data || "Unknown error",
      }),
      {
        status:
          axiosError.response?.status || StatusCodes.INTERNAL_SERVER_ERROR,
      },
    );
  }
}
