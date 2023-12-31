import { getIdToken } from "@/src/utils/sessionTokenAccessor";
import { getServerSession } from "next-auth";

import { authOptions } from "../[...nextauth]/auth-options";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (session) {
    const idToken = await getIdToken();

    // this will log out the user on Keycloak side
    var url = `${
      process.env.END_SESSION_URL
    }?id_token_hint=${idToken}&post_logout_redirect_uri=${encodeURIComponent(
      process.env.NEXTAUTH_URL as string,
    )}`;

    try {
      const resp = await fetch(url, { method: "GET" });
    } catch (err) {
      console.error("logout: ", err);
      return new Response(JSON.stringify("Failed to logout"), { status: 500 });
    }
  }
  return new Response(JSON.stringify("Logouted"), { status: 200 });
}
