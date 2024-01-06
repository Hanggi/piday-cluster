import { Module } from "@nestjs/common";

import { TasksService } from "./task.service";
import { HttpModule } from "@nestjs/axios";
import { PrismaService } from "../lib/prisma/prisma.service";

@Module({
  imports: [HttpModule],
  providers: [TasksService, PrismaService],
})
export class TaskModule {}
