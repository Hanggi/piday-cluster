import { Module } from "@nestjs/common";

import { PrismaService } from "../lib/prisma/prisma.service";
import { VirtualEstateController } from "./virtual-estate.controller";
import { VirtualEstateService } from "./virtual-estate.service";

@Module({
  controllers: [VirtualEstateController],
  providers: [VirtualEstateService, PrismaService],
})
export class VirtualEstateModule {}
