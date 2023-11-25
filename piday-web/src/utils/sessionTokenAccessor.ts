import { getServerSession } from "next-auth";

import { authOptions } from "../app/api/auth/[...nextauth]/auth-options";
import { decrypt } from "./encryption";

export async function getAccessToken() {
  const session: any = await getServerSession(authOptions);
  if (session && session?.access_token) {
    const accessTokenDecrypted = decrypt(session?.access_token);
    return accessTokenDecrypted;
  }
  return null;
}

export async function getIdToken() {
  const session: any = await getServerSession(authOptions);
  if (session && session?.id_token) {
    const idTokenDecrypted = decrypt(session?.id_token);
    return idTokenDecrypted;
  }
  return null;
}
