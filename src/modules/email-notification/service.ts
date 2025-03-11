import {
  AbstractNotificationProviderService,
  MedusaError,
} from "@medusajs/framework/utils";
import {
  Logger,
  ProviderSendNotificationDTO,
  ProviderSendNotificationResultsDTO,
} from "@medusajs/framework/types";
import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import * as templates from "./templates";

type InjectedDependencies = {
  logger: Logger;
};

type Options = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
};

class EmailNotificationProviderService extends AbstractNotificationProviderService {
  protected logger_: Logger;
  protected options_: Options;
  // assuming you're initializing a client
  protected transport;

  static identifier = "email-notification";

  constructor({ logger }: InjectedDependencies, options: Options) {
    super();

    this.logger_ = logger;
    this.options_ = options;

    this.transport = nodemailer.createTransport({
      service: "SendPulse",
      auth: {
        user: options.user,
        pass: options.pass,
      },
    });
  }

  static validateOptions(options: Record<any, any>) {
    if (!options.host) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Host is required in email-notification provider options."
      );
    }
    if (!options.port) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Port is required in email-notification provider options."
      );
    }
    if (options.secure === undefined) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Secure is required in email-notification provider options."
      );
    }
    if (!options.user) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "User is required in email-notification provider options."
      );
    }
    if (!options.pass) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Pass is required in email-notification provider options."
      );
    }
  }

  // @ts-ignore
  async send(notification: ProviderSendNotificationDTO) {
    const template = templates[`${notification.template}Template`];

    const html = await ejs.render(template.html, {
      ...notification.data,
    });

    const subject = await ejs.render(template.subject, {
      ...notification.data,
    });

    const mail = await this.transport.sendMail({
      from: "v.ostafiychuk20@gmail.com",
      to: notification.to,
      subject,
      html,
    });

    console.log(mail);
  }
}

export default EmailNotificationProviderService;
