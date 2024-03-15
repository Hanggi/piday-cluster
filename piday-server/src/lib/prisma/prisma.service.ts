import { PrismaClient } from "@prisma/client";
import chalk from "chalk";
import config from "config";

import { Injectable, OnModuleInit } from "@nestjs/common";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      log: config.get("prismaDebug")
        ? ["query", "info", "warn", "error"]
        : ["warn", "error"],
    });
  }

  async onModuleInit() {
    if (config.get("prismaDebug")) {
      // @ts-expect-error - This is a private property, but we need to access it to set the log level
      this.$on("query", (e: any) => {
        console.info("Params: " + chalk.yellow(e.params));
        if (e.duration > 500) {
          console.info("Duration: " + chalk.red(e.duration + "ms"));
        } else if (e.duration > 100) {
          console.info("Duration: " + chalk.magenta(e.duration + "ms"));
        } else if (e.duration > 50) {
          console.info("Duration: " + chalk.yellow(e.duration + "ms"));
        } else {
          console.info("Duration: " + chalk.green(e.duration + "ms"));
        }
      });
    }

    await this.$connect();
  }
}
