import { Test, TestingModule } from "@nestjs/testing";

import { MailgunModule } from "../lib/mailgun/mailgun.module";
import { RedisModule } from "../lib/redis/redis.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

describe("AuthController", () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
      imports: [RedisModule, MailgunModule],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
