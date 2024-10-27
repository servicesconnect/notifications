import { winstonLogger } from "@notifications/config";
import { emailTemplates } from "@notifications/config/templates";
import { SendEmailDTO } from "@notifications/models/notifications.model";
import { Logger } from "winston";

const log: Logger = winstonLogger("mailTransport", "debug");

async function sendEmail(dto: SendEmailDTO): Promise<void> {
  try {
    emailTemplates(dto);
    log.info("Email sent successfully.");
  } catch (error) {
    log.log(
      "error",
      "NotificationsService MailTransport sendEmail() method error:",
      error
    );
  }
}

export { sendEmail };
