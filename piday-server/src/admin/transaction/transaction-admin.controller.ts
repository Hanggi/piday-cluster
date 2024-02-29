import { AuthenticatedRequest } from "@/src/lib/keycloak/interfaces/authenticated-request";
import { KeycloakJwtAdminGuard } from "@/src/lib/keycloak/keycloak-jwt-admin.guard";

import { Controller, Get, Query, Req, Res, UseGuards } from "@nestjs/common";

import { OrderByOptions, SortByOptions } from "../dto/admin.dto";
import { TransactionAdminService } from "./transaction-admin.service";

@Controller("admin/transactions")
@UseGuards(KeycloakJwtAdminGuard)
export class TransactionAdminController {
  constructor(
    private readonly transactionAdminService: TransactionAdminService,
  ) {}

  @Get()
  async getTransactionList(
    @Req() req: AuthenticatedRequest,
    @Query("page") page: number = 1,
    @Query("size") size: number = 50,
    @Query("sort") sort: SortByOptions = SortByOptions.CREATED_AT,
    @Query("orderBy") orderBy: OrderByOptions = OrderByOptions.DESC,
  ) {
    const transactionRes =
      await this.transactionAdminService.getTransactionList({
        page: +page,
        size: +size,
        sortBy: sort || "createdAt",
        sortOrder: orderBy || "desc",
      });

    const transactionsJson = transactionRes.transactions.map((transaction) => {
      return {
        ...transaction,
        transactionID: transaction.transactionID.toString(),
      };
    });

    console.log(transactionsJson);
    return {
      success: true,
      transactions: transactionsJson,
      totalCount: transactionRes.totalCount,
    };
  }
}
