import { Injectable } from "@nestjs/common";

import { ServiceException } from "../lib/exceptions/service-exception";
import { generateInvitationCode } from "../lib/generate-id/generate-user-id";
import { KeycloakService } from "../lib/keycloak/keycloak.service";
import { PrismaService } from "../lib/prisma/prisma.service";
import { UserResponseDto } from "./dto/user.dto";
import {
  comparePaymentPassword,
  encodePaymentPassword,
} from "./utils/paymentPassword";

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

    // const visibleID = getUserVisibleID(user.id); // Replace user ID with visible ID
    return { ...user };
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

  // =============================================================================
  // Payment password
  // =============================================================================

  // Set payment password
  async setPaymentPassword({
    userID,
    password,
  }: {
    userID: string;
    password: string;
  }) {
    const user = await this.prisma.user.findUnique({
      where: {
        keycloakID: userID,
      },
    });
    if (!user) {
      throw new ServiceException("User not found", "USER_NOT_FOUND");
    }

    if (user.paymentPassword) {
      throw new ServiceException(
        "Payment password already set",
        "PAYMENT_PASSWORD_ALREADY_SET",
      );
    }

    const passwordHash = encodePaymentPassword(password);

    await this.prisma.user.update({
      data: {
        paymentPassword: passwordHash,
      },
      where: {
        keycloakID: userID,
      },
    });
  }

  async checkPaymentPassword({
    userID,
    password,
  }: {
    userID: string;
    password: string;
  }) {
    const user = await this.prisma.user.findUnique({
      where: {
        keycloakID: userID,
      },
    });
    if (!user) {
      throw new ServiceException("User not found", "USER_NOT_FOUND");
    }

    // ignore payment password not set
    if (!user.paymentPassword) {
      return;
    }

    const isMatch = comparePaymentPassword(password, user.paymentPassword);
    if (!isMatch) {
      throw new ServiceException(
        "Invalid payment password",
        "INVALID_PASSWORD",
      );
    }
  }
}
