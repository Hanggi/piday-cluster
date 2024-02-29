import { User } from "@/src/features/auth/interface/User.interface";
import { jwtDecode } from "jwt-decode";

export function decodeAccessToken(accessToken: string): User {
  const userInfo: any = jwtDecode(accessToken);

  return {
    id: userInfo.sub ?? "",
    sid: userInfo.sub ?? "",
    email: userInfo.email ?? "",
    emailVerified: userInfo.email_verified ?? false,

    piWalletAddress: userInfo.pi_wallet_address ?? "", // TODO: get pi wallet address

    username: userInfo.username ?? "",
    name: userInfo.name ?? "",
    givenName: userInfo.given_name ?? "",
    familyName: userInfo.family_name ?? "",
    preferredUsername: userInfo.preferred_username ?? "",

    roles: userInfo.realm_access.roles ?? [],
    createdAt: userInfo.iat ?? "",
  };
}
