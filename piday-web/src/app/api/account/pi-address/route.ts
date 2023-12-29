import { HeaderFilters } from "@/src/features/axios/header-filters";
import instance from "@/src/features/axios/instance";
import { StatusCodes } from "http-status-codes";

export async function PUT(request: Request) {
  const { headers } = request;

  const body = await request.json();
  const { piWalletAddress } = body;
  try {
    const res = await instance.put(
      "/account/pi-address",
      { piWalletAddress },
      {
        headers: HeaderFilters(headers),
      },
    );

    return new Response(
      JSON.stringify({
        message: "Update pi address successfully.",
        user: res.data.user,
      }),
      {
        status: StatusCodes.OK,
      },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        message: "Update pi address failed.",
        data: err,
      }),
      {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      },
    );
  }
}
