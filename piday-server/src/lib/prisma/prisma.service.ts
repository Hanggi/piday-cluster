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
        : ["error"],
    });
  }

  async onModuleInit() {
    if (config.get("prismaDebug")) {
      // @ts-expect-error - This is a private property, but we need to access it to set the log level
      this.$on("query", (e: any) => {
        console.log("Params: " + chalk.yellow(e.params));
        if (e.duration > 500) {
          console.log("Duration: " + chalk.red(e.duration + "ms"));
        } else if (e.duration > 100) {
          console.log("Duration: " + chalk.magenta(e.duration + "ms"));
        } else if (e.duration > 50) {
          console.log("Duration: " + chalk.yellow(e.duration + "ms"));
        } else {
          console.log("Duration: " + chalk.green(e.duration + "ms"));
        }
      });
    }

    await this.$connect();
  }
}
