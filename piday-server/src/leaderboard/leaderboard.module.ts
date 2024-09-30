import { Module } from "@nestjs/common";

import { KeycloakService } from "../lib/keycloak/keycloak.service";
import { PrismaService } from "../lib/prisma/prisma.service";
import { LeaderBoardController } from "./leaderboard.controller";
import { LeaderBoardService } from "./leaderboard.service";

@Module({
  imports: [],
  controllers: [LeaderBoardController],
  providers: [LeaderBoardService, PrismaService, KeycloakService],
})
export class LeaderBoardModule {}
