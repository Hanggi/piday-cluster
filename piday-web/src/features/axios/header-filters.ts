import { decrypt } from "@/src/utils/encryption";

export function HeaderFilters(headers: Headers) {
  let authorization = headers.get("authorization");
  if (authorization && authorization.split(" ").length >= 2) {
    authorization =
      authorization.split(" ")[0] + " " + decrypt(authorization.split(" ")[1]);
  }

  return {
    "user-agent": headers.get("user-agent") || "",
    "accept-language": headers.get("accept-language") || "",

    "x-forwarded-for": headers.get("x-forwarded-for") || "",
    "x-forwarded-proto": headers.get("x-forwarded-proto") || "",
    "x-forwarded-host": headers.get("x-forwarded-host") || "",
    "x-forwarded-port": headers.get("x-forwarded-port") || "",

    authorization: authorization || "",
  };
}
