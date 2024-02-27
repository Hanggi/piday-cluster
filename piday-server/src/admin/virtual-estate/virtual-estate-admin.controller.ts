import { Controller, Get, UseGuards } from "@nestjs/common";

import { VirtualEstateAdminService } from "./virtual-estate-admin.service";

@Controller("admin/virtual-estates")
export class VirtualEstateAdminController {
  constructor(
    private readonly virtualEstateAdminService: VirtualEstateAdminService,
  ) {}

  @Get()
  // @UseGuards()
  async getVirtualEstateList() {
    console.log("???");

    const veList = await this.virtualEstateAdminService.getVirtualEstateList(
      {},
    );

    return {
      success: true,
      virtualEstates: veList,
    };
  }
}
