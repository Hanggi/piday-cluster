import { Module } from "@nestjs/common";

import { mailgunProvider } from "./mailgun.provider";

@Module({
  providers: [...mailgunProvider],
  exports: [...mailgunProvider],
})
export class MailgunModule {}
