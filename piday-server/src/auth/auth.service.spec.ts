import { Test, TestingModule } from "@nestjs/testing";

import { MailgunModule } from "../lib/mailgun/mailgun.module";
import { RedisModule } from "../lib/redis/redis.module";
import { AuthService } from "./auth.service";

describe("AuthService", () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RedisModule, MailgunModule],
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
