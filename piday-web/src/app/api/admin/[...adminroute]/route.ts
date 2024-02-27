import instance from "@/src/features/axios/instance";

import { NextRequest } from "next/server";

async function handler(request: NextRequest) {
  // console.log("???");
  // console.log(request);

  // console.log(request.headers);

  // console.log(request.url);
  // console.log(request.url.split("/api")[1]);
  try {
    const res = await instance.request({
      method: request.method,
      url: request.url.split("/api")[1],

      data: request.body,
      // headers: request.headers as any,
    });

    return new Response(JSON.stringify(res.data), {
      status: res.status,
    });
  } catch (err) {
    console.error(err);
  }
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE };
