import config from "config";
import { EmailParams, MailerSend, Recipient, Sender } from "mailersend";
import { IMailgunClient } from "mailgun.js/Interfaces";

import { Inject, Injectable } from "@nestjs/common";

import { ServiceException } from "../exceptions/service-exception";

@Injectable()
export class MailService {
  mailerSend: MailerSend;

  constructor(@Inject("MAILGUN_CLIENT") readonly mailgun: IMailgunClient) {
    this.mailerSend = new MailerSend({
      apiKey: config.get<string>("mailerSend.apiKey"),
    });
  }

  async sendTemplateEmail({
    from,
    to,
    subject,
    template,
    variables,
    replyTo = "support@piday.world",
  }: {
    from?: string;
    to: string;
    subject: string;
    template: string;
    variables?: Record<string, string>;
    replyTo?: string;
  }) {
    const sentFrom = new Sender(
      from || "services@piday.world",
      "PiDay Services",
    );

    const recipients = [new Recipient(to.trim(), "PiDay User")];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setSubject(subject)
      .setTemplateId(template)
      .setPersonalization([
        {
          email: to.trim(),
          data: variables,
        },
      ]);

    try {
      await this.mailerSend.email.send(emailParams);
    } catch (err) {
      console.error("Send email failed:", err);
      throw new ServiceException("Send email failed", "SEND_EMAIL_FAILED");
    }
  }
}

// test
