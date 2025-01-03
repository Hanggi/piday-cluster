import { HeaderFilters } from "@/src/features/axios/header-filters";
import instance from "@/src/features/axios/instance";
import { AxiosError } from "axios";
import { StatusCodes } from "http-status-codes";

export async function POST(request: Request) {
  const { headers } = request;
  const req = await request.json();

  const body = {
    code: req.code,
    email: req.email,
    userID: req.userID,
  };

  try {
    const res = await instance.post(
      `${process.env.BACKEND_BASE_URL}/auth/migrate-to-email-account`,
      {
        ...body,
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
    console.error(
      "Updating password failed!!",
      axiosError.response?.status,
      axiosError?.response?.data,
    );
    return new Response(
      JSON.stringify({
        success: false,
        data: axiosError?.response?.data,
        message: "updating password failed",
      }),
      {
        status: axiosError.response?.status,
      },
    );
  }
}
