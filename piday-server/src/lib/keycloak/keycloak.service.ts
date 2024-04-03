import KeycloakAdminClient from "@keycloak/keycloak-admin-client";
import UserRepresentation from "@keycloak/keycloak-admin-client/lib/defs/userRepresentation";
import { Credentials } from "@keycloak/keycloak-admin-client/lib/utils/auth";
import config from "config";

import { Injectable } from "@nestjs/common";

import { loadKeycloakAdminClient } from "./kc";

@Injectable()
export class KeycloakService {
  kcAdminClient: KeycloakAdminClient;
  constructor() {
    loadKeycloakAdminClient().then((kc) => {
      this.kcAdminClient = new kc();
    });
  }

  // This is keycloak admin client
  async getAccessToken() {
    const credentials: Credentials = {
      grantType: "client_credentials",
      clientId: config.get<string>("keycloak.clientId"),
      clientSecret: config.get<string>("keycloak.clientSecret"),
    };
    this.kcAdminClient.setConfig({
      realmName: config.get<string>("keycloak.realm"),
      baseUrl: config.get<string>("keycloak.baseUrl"),
    });

    await this.kcAdminClient.auth(credentials);

    return await this.kcAdminClient.getAccessToken();
  }

  // async getCertificate() {
  //   const keyInfo = await this.kcAdminClient.clients.getKeyInfo();
  //   console.log(keyInfo);
  //   return keyInfo;
  // }

  async findUserByEmail(email: string): Promise<UserRepresentation> {
    await this.getAccessToken();
    const users = await this.kcAdminClient.users.find({
      email,
    });
    return users[0];
  }

  async createUser(user: UserRepresentation): Promise<UserRepresentation> {
    await this.getAccessToken();
    return await this.kcAdminClient.users.create(user);
  }

  async authenticateOldPassword(email: string, password: string) {
    const keycloakTokenUrl = `${config.get<string>("keycloak.baseUrl")}/realms/piday/protocol/openid-connect/token`;

    return await fetch(keycloakTokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: config.get<string>("keycloak.clientId") as string,
        client_secret: config.get<string>("keycloak.clientSecret") as string,
        grant_type: "password",
        username: email,
        password: password,
      }),
    });
  }
  async updateAccountPassword(userID: string, password: string) {
    try {
      await this.getAccessToken();

      await this.kcAdminClient.users.resetPassword({
        id: userID,
        credential: {
          type: "password",
          value: password,
          temporary: false,
        },
      });

      return true;
    } catch (error) {
      return false;
    }
  }
}
