import config from "config";
import { IMailgunClient } from "mailgun.js/Interfaces";

import { Inject, Injectable } from "@nestjs/common";

import { ServiceException } from "../exceptions/service-exception";

@Injectable()
export class MailService {
  constructor(@Inject("MAILGUN_CLIENT") readonly mailgun: IMailgunClient) {}

  async sendTemplateEmail({
    from,
    to,
    subject,
    template,
    variables,
    replyTo,
  }: {
    from: string;
    to: string;
    subject: string;
    template: string;
    variables: Record<string, string>;
    replyTo?: string;
  }) {
    const mg = this.mailgun;

    const mailgunData = {
      from,
      to,
      subject,
      template,
      "h:X-Mailgun-Variables": JSON.stringify(variables),
      "h:Reply-To": replyTo,
    };

    try {
      await mg.messages.create(
        config?.get<string>("mailgun.domain"),
        mailgunData,
      );
    } catch (error) {
      console.error("Send email failed:", error);
      throw new ServiceException("Send email failed", "SEND_EMAIL_FAILED");
    }
  }
}
