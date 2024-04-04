import { HeaderFilters } from "@/src/features/axios/header-filters";
import instance from "@/src/features/axios/instance";
import { AxiosError } from "axios";
import { StatusCodes } from "http-status-codes";

export async function POST(request: Request, res: Response) {
  const { headers } = request;
  const req = await request.json();

  const body = {
    oldPassword: req.oldPassword,
    confirmPassword: req.confirmPassword,
    newPassword: req.newPassword,
  };

  try {
    const res = await instance.post(
      `${process.env.BACKEND_BASE_URL}/auth/update-password`,
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
        message: "Updating password failed",
      }),
      {
        status: axiosError.response?.status,
      },
    );
  }
}
