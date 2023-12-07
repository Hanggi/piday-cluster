import axios from "axios";
import { StatusCodes } from "http-status-codes";

import { NextRequest } from "next/server";

const MAPBOX_ACCESS_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lng = searchParams.get("lng");
  const lat = searchParams.get("lat");

  try {
    const res = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_ACCESS_TOKEN}`,
    );

    const data = res.data;

    return new Response(JSON.stringify(data), {
      status: StatusCodes.OK,
    });
  } catch (err) {
    console.error("Get map lace failed!!", err);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Get map lace failed",
      }),
      {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      },
    );
  }
}
