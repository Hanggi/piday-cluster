import Keycloak from "keycloak-js";

let keycloakInstance: Keycloak;

export function getKeycloakInstance() {
  if (!keycloakInstance) {
    keycloakInstance = new Keycloak({
      url: process.env.KEYCLOAK_BASE_URL,
      realm: "piday",
      clientId: "dev-auth-client",
    });
    keycloakInstance.init({}).then((auth) => {
      console.log(auth);
    });
  }
  return keycloakInstance;
}
