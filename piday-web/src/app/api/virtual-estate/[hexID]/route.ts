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
    const res = await instance.get("/virtual-estates/" + hexID);

    return new Response(JSON.stringify(res.data), {
      status: StatusCodes.OK,
    });
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response?.status === StatusCodes.NOT_FOUND) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "virtual estate not found",
        }),
        {
          status: StatusCodes.NOT_FOUND,
        },
      );
    }

    console.error(
      "Fail to get virtual estate!!",
      axiosError.response?.status,
      axiosError?.response?.data,
    );
    return new Response(
      JSON.stringify({
        success: false,
        message: "Fail to get virtual estate",
      }),
      {
        status:
          axiosError.response?.status || StatusCodes.INTERNAL_SERVER_ERROR,
      },
    );
  }
}

// Mint a new virtual estate
export async function POST(
  request: Request,
  { params, body }: { params: { hexID: string }; body: {} },
) {
  const { headers } = request;
  const hexID = params.hexID;

  try {
    const res = await instance.post(
      "/virtual-estates/" + hexID,
      {},
      {
        headers: HeaderFilters(headers),
      },
    );

    return new Response(JSON.stringify(res.data), {
      status: StatusCodes.OK,
    });
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    console.error(
      "Fail to mint virtual estate!!",
      axiosError.response?.status,
      axiosError?.response?.data,
    );

    const message = axiosError?.response?.data?.message;
    return new Response(
      JSON.stringify({
        success: false,
        message: message || "Fail to mint virtual estate",
      }),
      {
        status:
          axiosError.response?.status || StatusCodes.INTERNAL_SERVER_ERROR,
      },
    );
  }
}
