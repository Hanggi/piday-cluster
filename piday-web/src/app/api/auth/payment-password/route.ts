import { HeaderFilters } from "@/src/features/axios/header-filters";
import instance from "@/src/features/axios/instance";
import { AxiosError } from "axios";
import { StatusCodes } from "http-status-codes";

export async function POST(request: Request) {
  const { headers } = request;
  const req = await request.json();

  const body = {
    password: req.password,
    confirmPassword: req.confirmPassword,
  };

  try {
    const res = await instance.post(
      `${process.env.BACKEND_BASE_URL}/auth/payment-password`,
      {
        ...body,
      },
      {
        headers: HeaderFilters(headers),
      },
    );

    return new Response(
      JSON.stringify({ message: "Set payment password successfully." }),
      {
        status: StatusCodes.OK,
      },
    );
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(
      "Set payment password failed!!",
      axiosError.response?.status,
      axiosError?.response?.data,
    );
    return new Response(
      JSON.stringify({
        success: false,
        message: "Set payment password failed",
      }),
      {
        status: axiosError.response?.status,
      },
    );
  }
}
