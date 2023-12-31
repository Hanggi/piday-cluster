import { HeaderFilters } from "@/src/features/axios/header-filters";
import instance from "@/src/features/axios/instance";
import { StatusCodes } from "http-status-codes";

export async function GET(request: Request) {
  const { headers } = request;

  try {
    const res = await instance.get("/account/balance", {
      headers: HeaderFilters(headers),
    });

    return new Response(
      JSON.stringify({
        message: "Get balance successfully.",
        balance: res.data.balance,
      }),
      {
        status: StatusCodes.OK,
      },
    );
  } catch (err) {
    console.error("Fail to get balance!!", err);

    return new Response(
      JSON.stringify({
        message: "Get balance failed.",
        data: err,
      }),
      {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      },
    );
  }
}
