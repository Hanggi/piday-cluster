import { encrypt } from "@/src/utils/encryption";
import { jwtDecode } from "jwt-decode";
import NextAuth, { AuthOptions } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";

// // this will refresh an expired access token, when needed
// async function refreshAccessToken(token: any) {
//   const resp = await fetch(`${process.env.REFRESH_TOKEN_URL}`, {
//     headers: { "Content-Type": "application/x-www-form-urlencoded" },
//     body: new URLSearchParams({
//       client_id: process.env.DEMO_FRONTEND_CLIENT_ID,
//       client_secret: process.env.DEMO_FRONTEND_CLIENT_SECRET,
//       grant_type: "refresh_token",
//       refresh_token: token.refresh_token,
//     }),
//     method: "POST",
//   });
//   const refreshToken = await resp.json();
//   if (!resp.ok) throw refreshToken;

//   return {
//     ...token,
//     access_token: refreshToken.access_token,
//     decoded: jwt_decode(refreshToken.access_token),
//     id_token: refreshToken.id_token,
//     expires_at: Math.floor(Date.now() / 1000) + refreshToken.expires_in,
//     refresh_token: refreshToken.refresh_token,
//   };
// }

export const authOptions: AuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID as string,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET as string,
      issuer: process.env.KEYCLOAK_ISSUER,
    }),
  ],
  // debug: true,
  callbacks: {
    // TODO: Fix any
    async jwt({ token, account }: any) {
      const nowTimeStamp = Math.floor(Date.now() / 1000);

      if (account) {
        // account is only available the first time this callback is called on a new session (after the user signs in)
        token.decoded = jwtDecode(account.access_token);
        token.access_token = account.access_token;
        token.id_token = account.id_token;
        token.expires_at = account.expires_at;
        token.refresh_token = account.refresh_token;
        return token;
      } else if (nowTimeStamp < token.expires_at) {
        // token has not expired yet, return it
        return token;
      } else {
        // token is expired, try to refresh it
        console.log("Token has expired. Will refresh...");
      }
      return token;
    },
    async session({ session, token }: any) {
      // Send properties to the client
      session.access_token = encrypt(token.access_token); // see utils/sessionTokenAccessor.js
      session.id_token = encrypt(token.id_token); // see utils/sessionTokenAccessor.js
      session.roles = token.decoded.realm_access.roles;
      session.error = token.error;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
