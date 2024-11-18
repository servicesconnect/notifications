import path from "path";
import { Logger } from "winston";
import nodemailer, { Transporter } from "nodemailer";

import Email from "email-templates";
import { winstonLogger } from "./logger";
import { SendEmailDTO } from "@notifications/models/notifications.model";
import { envConfig } from "./env";

const log: Logger = winstonLogger("mailTransportHelper", "debug");

async function emailTemplates(dto: SendEmailDTO): Promise<void> {
  try {
    const smtpTransport: Transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: envConfig.sender_email,
        pass: envConfig.sender_email_password,
      },
    });
    const email: Email = new Email({
      message: {
        from: `Servicesconnect <${envConfig.sender_email}>`,
      },
      send: true,
      preview: false,
      transport: smtpTransport,
      views: {
        options: {
          extension: "ejs",
        },
      },
      juice: true,
      juiceResources: {
        preserveImportant: true,
        webResources: {
          relativeTo: path.join(__dirname, "../build"),
        },
      },
    });

    await email.send({
      template: path.join(
        __dirname,
        "..",
        "src/emails/templates",
        dto.template
      ),
      message: { to: dto.receiver },
      locals: dto.locals,
    });
  } catch (error) {
    log.error(error);
  }
}

export { emailTemplates };
