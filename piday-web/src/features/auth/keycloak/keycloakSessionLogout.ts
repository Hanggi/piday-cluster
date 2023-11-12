export async function keycloakSessionLogOut() {
  try {
    await fetch("/api/auth/logout", {
      method: "GET",
    });
  } catch (err) {
    console.error(err);
  }
}
