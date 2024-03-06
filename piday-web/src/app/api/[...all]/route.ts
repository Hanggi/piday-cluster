import instance from "@/src/features/axios/instance";
import { decrypt } from "@/src/utils/encryption";

import { NextRequest } from "next/server";

async function handler(request: NextRequest) {
  let authorization = request.headers.get("authorization");
  if (authorization && authorization.split(" ").length >= 2) {
    authorization =
      authorization.split(" ")[0] + " " + decrypt(authorization.split(" ")[1]);
  }
  const requestHeaders = new Headers(request.headers);
  if (authorization) {
    requestHeaders.set("authorization", authorization);
  }

  const headersForAxios = Object.fromEntries(
    Array.from(requestHeaders.entries()).map(([key, value]) => [
      key,
      cleanHeaderValue(value),
    ]),
  );
  try {
    const res = await instance.request({
      method: request.method,
      url: request.url.split("/api")[1],

      data: request.body,
      headers: headersForAxios,
    });

    return new Response(JSON.stringify(res.data), {
      status: res.status,
    });
  } catch (err) {
    console.log("Error on all route!");
    // console.error(err);
  }
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE };

const cleanHeaderValue = (value: string) =>
  typeof value === "string" ? value.replace(/[\r\n\t]/g, "") : value;
