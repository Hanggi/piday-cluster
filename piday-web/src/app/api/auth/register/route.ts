import { HeaderFilters } from "@/src/features/axios/header-filters";
import instance from "@/src/features/axios/instance";
import { AxiosError } from "axios";
import { StatusCodes } from "http-status-codes";

export async function POST(request: Request, res: Response) {
  const { headers } = request;
  const req = await request.json();

  const body = {
    username: req.username,
    password: req.password,
    email: req.email,
    code: req.code,
    inviteCode: req.inviteCode,
  };

  try {
    const res = await instance.post(
      `${process.env.BACKEND_BASE_URL}/auth/email-signup`,
      {
        ...body,
      },
      {
        headers: HeaderFilters(headers),
      },
    );

    return new Response(
      JSON.stringify({ message: "User registered successfully." }),
      {
        status: StatusCodes.OK,
      },
    );
  } catch (error) {
    const axiosError = error as AxiosError;

    console.error(
      "User registration failed!!",
      axiosError.response?.status,
      axiosError?.response?.data,
    );
    console.log(axiosError?.response);
    return new Response(
      JSON.stringify({
        success: false,
        message:
          (axiosError?.response?.data as any)?.message ||
          "User registration failed",
      }),
      {
        status: axiosError.response?.status,
      },
    );
  }
}
