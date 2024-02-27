import { AuthenticatedRequest } from "@/src/lib/keycloak/interfaces/authenticated-request";

import { Controller, Get, Query, Req, Res, UseGuards } from "@nestjs/common";

import { TransactionAdminService } from "./transaction-admin.service";

@Controller("admin/transactions")
export class TransactionAdminController {
  constructor(
    private readonly transactionAdminService: TransactionAdminService,
  ) {}

  @Get()
  // TODO(Hanggi): Add admin guard
  // @UseGuards()
  async getTransactionList(
    @Req() req: AuthenticatedRequest,
    @Query("page") page: number = 1,
    @Query("size") size: number = 50,
  ) {
    const transactionRes =
      await this.transactionAdminService.getTransactionList({
        page: +page,
        size: +size,
        sortBy: "createdAt",
        sortOrder: "desc",
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
