import { KeycloakCredentials, KeycloakToken } from "./creadentials.interface";

export async function authenticateWithKeycloak(
  credentials: KeycloakCredentials,
): Promise<KeycloakToken | null> {
  const keycloakTokenUrl = `https://piday-dev-auth.dvqdev.com/realms/piday/protocol/openid-connect/token`;

  const tokenResponse = await fetch(keycloakTokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: process.env.KEYCLOAK_CLIENT_ID as string,
      client_secret: process.env.KEYCLOAK_CLIENT_SECRET as string,
      grant_type: "password",
      username: credentials.email,
      password: credentials.password,
    }),
  });

  const data = await tokenResponse.json();

  if (tokenResponse.ok) {
    return data;
  } else {
    return null;
  }
}
