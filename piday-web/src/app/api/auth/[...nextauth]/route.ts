import { authenticateWithKeycloak } from "@/src/features/auth/keycloak/authenticateWithKeycloak";
import { decodeAccessToken } from "@/src/features/auth/keycloak/decodeAccessToken";
import { refreshAccessToken } from "@/src/features/auth/keycloak/refreshAccessToken";
import { encrypt } from "@/src/utils/encryption";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import KeycloakProvider from "next-auth/providers/keycloak";

export const authOptions: AuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID as string,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET as string,
      issuer: process.env.KEYCLOAK_ISSUER,
    }),
    CredentialsProvider({
      name: "Email Sign In",

      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const token = await authenticateWithKeycloak({
          email: credentials?.username as string,
          password: credentials?.password as string,
        });

        if (token) {
          const accessToken = token.access_token;
          const userInfo = decodeAccessToken(accessToken);

          return {
            id: userInfo.sid,
            name: userInfo.preferredUsername,
            email: userInfo.email,
            username: userInfo.preferredUsername,
            accessToken: token.access_token,
            refreshToken: token.refresh_token,
            expiresIn: token.expires_in,
            //refresh_expires_in
            roles: userInfo.roles,
          };
        } else {
          throw new Error("Could not log you in."); // 登录失败
        }
      },
    }),
  ],
  // debug: true,
  callbacks: {
    // TODO: Fix any
    async jwt({ token, user }: any) {
      const nowTimeStamp = Math.floor(Date.now() / 1000);

      if (user) {
        // account is only available the first time this callback is called on a new session (after the user signs in)
        token.accessToken = user.accessToken;

        token.expiresAt = Math.floor(Date.now() / 1000 + user.expiresIn);
        token.refreshToken = user.refreshToken;
        token.roles = user.roles;
        return token;
      } else if (nowTimeStamp < token.expiresAt) {
        // token has not expired yet, return it
        return token;
      } else {
        // token is expired, try to refresh it
        try {
          const newToken = await refreshAccessToken(token);
          return newToken;
        } catch (err) {
          console.error(err);
          return { ...token, error: "RefreshAccessTokenError" };
        }
      }
    },
    async session({ session, token }: any) {
      // Send properties to the client
      session.accessToken = encrypt(token.accessToken); // see utils/sessionTokenAccessor.js
      // session.id_token = encrypt(token.id_token); // see utils/sessionTokenAccessor.js
      session.roles = token.roles;
      session.error = token.error;
      session.expiresAt = token.expiresAt;

      // try {
      //   fetch(
      //     `${process.env.KEYCLOAK_BASE_URL}/realms/piday/protocol/openid-connect/userinfo`,
      //     {
      //       method: "GET",
      //       headers: {
      //         Authorization: `Bearer ${token.accessToken}`,
      //       },
      //     },
      //   )
      //     .then(async (res) => {
      //       console.log(await res.json());
      //     })
      //     .catch((err) => {
      //       console.error(err);
      //     });
      // } catch (error) {
      //   console.error(error);
      // }

      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
