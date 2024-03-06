import instance from "@/src/features/axios/instance";

import { NextRequest } from "next/server";

async function handler(request: NextRequest) {
  //   const requestHeaders = new Headers(request.headers);

  //   const headersForAxios = Object.fromEntries(
  //     Array.from(requestHeaders.entries()).map(([key, value]) => [
  //       key,
  //       cleanHeaderValue(value),
  //     ]),
  //   );
  const body = await request.json();
  console.log(body);
  try {
    const res = await instance.request({
      method: request.method,
      url: "/auth/pi-sign-in",

      data: {
        ...body,
      },
      //   headers: headersForAxios,
    });

    return new Response(JSON.stringify(res.data), {
      status: res.status,
    });
  } catch (err: any) {
    console.log("Error on pi sign in route!");
    console.error(err.response.data);
  }
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE };
