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
    const res = await instance.get("/virtual-estate/" + hexID);

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

    console.error("Fail to get virtual estate!!", axiosError);
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

export async function POST(
  request: Request,
  { params, body }: { params: { hexID: string }; body: {} },
) {
  const { headers } = request;
  const hexID = params.hexID;

  try {
    const res = await instance.post(
      "/virtual-estate/" + hexID,
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
    console.error("Fail to mint virtual estate!!", axiosError);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Fail to mint virtual estate",
      }),
      {
        status:
          axiosError.response?.status || StatusCodes.INTERNAL_SERVER_ERROR,
      },
    );
  }
}
