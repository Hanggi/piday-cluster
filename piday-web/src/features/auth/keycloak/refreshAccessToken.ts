// this will refresh an expired access token, when needed

export async function refreshAccessToken(token: any) {
  const keycloakTokenUrl = `${process.env.KEYCLOAK_BASE_URL}/realms/piday/protocol/openid-connect/token`;

  const resp = await fetch(keycloakTokenUrl, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.KEYCLOAK_CLIENT_ID as string,
      client_secret: process.env.KEYCLOAK_CLIENT_SECRET as string,
      grant_type: "refresh_token",
      refresh_token: token.refreshToken,
    }),
    method: "POST",
  });
  const refreshToken = await resp.json();
  if (!resp.ok) {
    throw new Error("Failed to refresh access token.", refreshToken);
  }

  return {
    ...token,
    accessToken: refreshToken.access_token,
    expiresAt: Math.floor(Date.now() / 1000 + refreshToken.expires_in),
    refreshToken: refreshToken.refresh_token,
  };
}
