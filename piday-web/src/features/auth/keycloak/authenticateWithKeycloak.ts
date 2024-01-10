import { KeycloakCredentials, KeycloakToken } from "./creadentials.interface";

export async function authenticateWithKeycloak(
  credentials: KeycloakCredentials,
): Promise<KeycloakToken | null> {
  const keycloakTokenUrl = `${process.env.KEYCLOAK_BASE_URL}/realms/piday/protocol/openid-connect/token`;

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

  console.log({
    client_id: process.env.KEYCLOAK_CLIENT_ID as string,
    client_secret: process.env.KEYCLOAK_CLIENT_SECRET as string,
    grant_type: "password",
    username: credentials.email,
    password: credentials.password,
  });

  const data = await tokenResponse.json();

  console.log(data);

  if (tokenResponse.ok) {
    return data;
  } else {
    return null;
  }
}
