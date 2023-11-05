import { User } from "@/src/features/auth/interface/User.interface";
import { jwtDecode } from "jwt-decode";

export function decodeAccessToken(accessToken: string): User {
  const userInfo: any = jwtDecode(accessToken);

  console.log(userInfo);
  return {
    sid: userInfo.sub ?? "",
    email: userInfo.email ?? "",
    emailVerified: userInfo.email_verified ?? false,

    name: userInfo.name ?? "",
    givenName: userInfo.given_name ?? "",
    familyName: userInfo.family_name ?? "",
    preferredUsername: userInfo.preferred_username ?? "",

    roles: userInfo.realm_access.roles ?? [],
  };
}
