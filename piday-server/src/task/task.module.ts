import { Module } from "@nestjs/common";

import { TasksService } from "./task.service";
import { HttpModule } from "@nestjs/axios";
import { PrismaService } from "../lib/prisma/prisma.service";
import { RedisModule } from "../lib/redis/redis.module";

@Module({
  imports: [HttpModule, RedisModule],
  providers: [TasksService, PrismaService],
})
export class TaskModule {}
