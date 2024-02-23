import config from "config";
import { EmailParams, MailerSend, Recipient, Sender } from "mailersend";
import { IMailgunClient } from "mailgun.js/Interfaces";

import { Inject, Injectable } from "@nestjs/common";

import { ServiceException } from "../exceptions/service-exception";

// AWS.config.update({
//   region: "ap-northeast-2",
//   accessKeyId: config.get<string>("ses.apikey"),
//   secretAccessKey: config.get<string>("ses.secret"),
// });

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
    replyTo,
  }: {
    from?: string;
    to: string;
    subject: string;
    template: string;
    variables?: Record<string, string>;
    replyTo?: string;
  }) {
    // const mg = this.mailgun;
    // const mailgunData = {
    //   from,
    //   to,
    //   subject,
    //   template,
    //   "h:X-Mailgun-Variables": JSON.stringify(variables),
    //   "h:Reply-To": replyTo,
    // };
    // try {
    //   await mg.messages.create(
    //     config?.get<string>("mailgun.domain"),
    //     mailgunData,
    //   );
    // } catch (error) {
    //   console.error("Send email failed:", error);
    //   throw new ServiceException("Send email failed", "SEND_EMAIL_FAILED");
    // }
    // const ses = this.ses;
    // const params = {
    //   Destination: {
    //     ToAddresses: [to],
    //   },
    //   from: "services@piday.world",
    //   subject: subject,
    //   Source: "your-email@example.com", // 发件人邮箱
    //   Template: "EmailVerificationCode",
    //   TemplateData: JSON.stringify(variables),
    //   ReplyToAddresses: ["support@piday.world"],
    // };
    // try {
    //   const result = await ses.sendTemplatedEmail(params).promise();
    //   return result;
    // } catch (error) {
    //   throw new Error(`Failed to send email: ${error.message}`);
    // }

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
