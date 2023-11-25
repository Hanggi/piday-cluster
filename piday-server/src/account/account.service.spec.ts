import { Test, TestingModule } from "@nestjs/testing";

import { PrismaService } from "../lib/prisma/prisma.service";
import { AccountService } from "./account.service";

describe("AccountService", () => {
  let service: AccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountService, PrismaService],
    }).compile();

    service = module.get<AccountService>(AccountService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should get my balance", async () => {
    const totalBalance = await service.getMyBalance();

    expect(totalBalance).toBeDefined();
  });
});
