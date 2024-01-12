import { Injectable } from "@nestjs/common";

import { KeycloakService } from "../lib/keycloak/keycloak.service";
import { PrismaService } from "../lib/prisma/prisma.service";

@Injectable()
export class UserService {
  constructor(
    private readonly keycloakService: KeycloakService,
    private readonly prisma: PrismaService,
  ) {}

  async getUserFromAccessToken() {}

  async getUser(userID: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        keycloakID: userID,
      },
    });

    if (!user) {
      return null;
    }

    return user;
  }
}
