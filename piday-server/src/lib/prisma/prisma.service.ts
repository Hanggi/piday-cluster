import { PrismaClient } from "@prisma/client";
import config from "config";

import { Injectable, OnModuleInit } from "@nestjs/common";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      log: config.get("prismaDebug")
        ? ["query", "info", "warn", "error"]
        : ["error"],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
