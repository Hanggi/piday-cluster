import { Injectable } from "@nestjs/common";

import {
  generateInvitationCode,
  getUserVisibleID,
} from "../lib/generate-id/generate-user-id";
import { KeycloakService } from "../lib/keycloak/keycloak.service";
import { PrismaService } from "../lib/prisma/prisma.service";
import { UserResponseDto } from "./dto/user.dto";

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

    const visibleID = getUserVisibleID(user.id);
    return { ...user, id: visibleID };
  }

  async getUserInfo(
    email?: string,
    userID?: string,
    walletAddress?: string,
  ): Promise<UserResponseDto> {
    let query;

    // Check if email exists
    if (email) {
      query = { email };
    } else if (walletAddress) {
      // Check if walletAddress exists if email doesn't
      query = { piWalletAddress: walletAddress };
    } else if (userID) {
      // Use userID if email and walletAddress don't exist
      query = { keycloakID: userID };
    } else {
      // Handle the case where none of the criteria are provided
      return null;
    }

    const user = await this.prisma.user.findUnique({
      where: query,
    });

    if (!user) return null;

    const userResponseDto: UserResponseDto = {
      id: user?.keycloakID,
      email: user.email,
      username: user.username,
      avatar: user.avatar,
      updatedAt: user.updatedAt,
      createdAt: user.createdAt,
    };
    return userResponseDto;
  }

  async generateInviteCode(userID: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        keycloakID: userID,
      },
    });

    if (!user) {
      return null;
    }
    const inviteCode = generateInvitationCode(user.id);
    return inviteCode;
  }
}
