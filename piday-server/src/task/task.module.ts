import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";

import { PrismaService } from "../lib/prisma/prisma.service";
import { RedisModule } from "../lib/redis/redis.module";
import { TasksService } from "./task.service";

@Module({
  imports: [HttpModule, RedisModule],
  providers: [TasksService, PrismaService],
})
export class TaskModule {}
