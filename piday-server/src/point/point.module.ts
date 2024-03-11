import { Module } from "@nestjs/common";

import { PrismaService } from "../lib/prisma/prisma.service";
import { PointController } from "./point.controller";
import { PointService } from "./point.service";

@Module({
  imports: [],
  controllers: [PointController],
  providers: [PointService, PrismaService],
})
export class PointModule {}
