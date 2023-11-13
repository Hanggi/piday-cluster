import { Controller, Get, Query } from "@nestjs/common";

import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get("send-email-verification")
  sendEmailVerification(@Query("email") email: string) {
    this.authService.setVerificationCodeAndSendEmail(email);

    return "Email verification sent";
  }
}
