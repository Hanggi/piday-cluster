import config from "config";
import FormData from "form-data";
import Mailgun from "mailgun.js";

export const mailgunProvider = [
  {
    provide: "MAILGUN_CLIENT",
    useFactory: async () => {
      const mailgun = new Mailgun(FormData);

      const mg = mailgun.client({
        username: "api",
        key: config?.get<string>("mailgun.apiKey"),
      });
      return mg;
    },
  },
];
