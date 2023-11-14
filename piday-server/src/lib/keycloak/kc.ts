type ImportClass<T, K extends keyof T> = T extends Record<K, infer S>
  ? S extends new (...args: any[]) => infer R
    ? R
    : never
  : never;
export type KeycloakAdminClient = ImportClass<
  typeof import("@keycloak/keycloak-admin-client"),
  "default"
>;

export async function loadKeycloakAdminClient() {
  try {
    return (await eval("import('@keycloak/keycloak-admin-client')"))
      .default as typeof import("@keycloak/keycloak-admin-client").default;
  } catch (error) {
    return (await import("@keycloak/keycloak-admin-client")).default;
  }
}
