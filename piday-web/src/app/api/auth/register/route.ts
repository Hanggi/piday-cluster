import { AxiosError } from "axios";
import { StatusCodes } from "http-status-codes";

export async function POST(request: Request, res: Response) {
  const req = await request.json();

  const body = {
    username: req.username,
    password: req.password,
    email: req.email,
    code: req.code,
  };

  try {
    const res = await fetch(
      `${process.env.BACKEND_BASE_URL}/auth/email-signup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );
    const jsonRes = await res.json();

    if (!res.ok) {
      return new Response(
        JSON.stringify({
          success: false,
          message: jsonRes.message,
        }),
        {
          status: jsonRes.statusCode,
        },
      );
    }

    return new Response(
      JSON.stringify({ message: "User registered successfully." }),
      {
        status: StatusCodes.OK,
      },
    );
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("User registration failed!!", axiosError);
    return new Response(
      JSON.stringify({
        success: false,
        message: "User registration failed",
      }),
      {
        status: axiosError.response?.status,
      },
    );
  }
}
