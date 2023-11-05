import Keycloak from "keycloak-js";

let keycloakInstance: Keycloak;

export function getKeycloakInstance() {
  if (!keycloakInstance) {
    keycloakInstance = new Keycloak({
      url: "https://piday-dev-auth.dvqdev.com",
      realm: "piday",
      clientId: "dev-auth-client",
    });
    keycloakInstance.init({}).then((auth) => {
      console.log(auth);
    });
  }
  return keycloakInstance;
}
// export const keycloak = new Keycloak({
//   url: "https://piday-dev-auth.dvqdev.com",
//   realm: "piday",
//   clientId: "dev-auth-client",
// });

// try {
//     const authenticated = await keycloak.init();
//     console.log(`User is ${authenticated ? 'authenticated' : 'not authenticated'}`);
// } catch (error) {
//     console.error('Failed to initialize adapter:', error);
// }
