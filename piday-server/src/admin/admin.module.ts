import { Module } from "@nestjs/common";

import { PrismaService } from "../lib/prisma/prisma.service";
import { VirtualEstateAdminController } from "./virtual-estate/virtual-estate-admin.controller";
import { VirtualEstateAdminService } from "./virtual-estate/virtual-estate-admin.service";

@Module({
  controllers: [VirtualEstateAdminController],
  providers: [VirtualEstateAdminService, PrismaService],
})
export class AdminAPIModule {}
