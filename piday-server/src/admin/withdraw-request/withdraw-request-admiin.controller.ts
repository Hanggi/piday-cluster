import { AuthenticatedRequest } from "@/src/lib/keycloak/interfaces/authenticated-request";
import { KeycloakJwtAdminGuard } from "@/src/lib/keycloak/keycloak-jwt-admin.guard";

import { Controller, Get, Query, Req, Res, UseGuards } from "@nestjs/common";

import { OrderByOptions, SortByOptions } from "../dto/admin.dto";
import { WithdrawRequestAdminService } from "./withdraw-request-admin.service";

@Controller("admin/withdraw-request")
@UseGuards(KeycloakJwtAdminGuard)
export class WithdrawRequestAdminController {
  constructor(
    private readonly withdrawRequestAdminService: WithdrawRequestAdminService,
  ) {}

  @Get()
  async getWithdrawRequest(
    @Req() req: AuthenticatedRequest,
    @Query("page") page: number = 1,
    @Query("size") size: number = 50,
    @Query("sort") sort: SortByOptions = SortByOptions.CREATED_AT,
    @Query("orderBy") orderBy: OrderByOptions = OrderByOptions.DESC,
  ) {
    const veRes = await this.withdrawRequestAdminService.getWithdrawRequest({
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
