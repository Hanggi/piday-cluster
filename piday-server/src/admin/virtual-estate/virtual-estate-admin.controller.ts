import { AuthenticatedRequest } from "@/src/lib/keycloak/interfaces/authenticated-request";

import { Controller, Get, Query, Req, Res, UseGuards } from "@nestjs/common";

import { OrderByOptions, SortByOptions } from "../dto/admin.dto";
import { VirtualEstateAdminService } from "./virtual-estate-admin.service";

@Controller("admin/virtual-estates")
export class VirtualEstateAdminController {
  constructor(
    private readonly virtualEstateAdminService: VirtualEstateAdminService,
  ) {}

  @Get()
  // TODO(Hanggi): Add admin guard
  // @UseGuards()
  async getVirtualEstateList(
    @Req() req: AuthenticatedRequest,
    @Query("page") page: number = 1,
    @Query("size") size: number = 50,
    @Query("sort") sort: SortByOptions = SortByOptions.CREATED_AT,
    @Query("orderBy") orderBy: OrderByOptions = OrderByOptions.DESC,
  ) {
    const veRes = await this.virtualEstateAdminService.getVirtualEstateList({
      page: +page,
      size: +size,
      sortBy: sort || "createdAt",
      sortOrder: orderBy || "desc",
    });

    return {
      success: true,
      virtualEstates: veRes.virtualEstates,
      totalCount: veRes.totalCount,
    };
  }
}
