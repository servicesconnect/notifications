import {
  createQueueConnection,
  envConfig,
  winstonLogger,
} from "@notifications/config";
import { sendEmail } from "@notifications/emails/mail.transport";
import {
  EmailLocals,
  SendEmailDTO,
} from "@notifications/models/notifications.model";
import { Channel, ConsumeMessage } from "amqplib";
import { Logger } from "winston";

const log: Logger = winstonLogger("emailConsumer", "debug");

export async function consumeAuthEmailMessages(
  channel: Channel
): Promise<void> {
  try {
    if (!channel) {
      channel = (await createQueueConnection()) as Channel;
    }
    const exchangeName = "servicesconnect-auth-notification";
    const routingKey = "auth-email";
    const queueName = "auth-email-queue";
    await channel.assertExchange(exchangeName, "direct");
    const servicesconnectQueue = await channel.assertQueue(queueName, {
      durable: true,
      autoDelete: false,
    });
    await channel.bindQueue(
      servicesconnectQueue.queue,
      exchangeName,
      routingKey
    );
    channel.consume(
      servicesconnectQueue.queue,
      async (msg: ConsumeMessage | null) => {
        const {
          receiver_email: receiverEmail,
          username,
          verify_link,
          reset_link,
          template,
          otp,
        } = JSON.parse(msg!.content.toString());

        const locals: EmailLocals = {
          app_link: `${envConfig.client_url}`,
          app_icon: "https://i.ibb.co/Kyp2m0t/cover.png",
          username,
          verify_link,
          reset_link,
          otp,
        };
        // send emails
        await sendEmail({ template, receiver: receiverEmail, locals });
        // acknowledge
        channel.ack(msg!);
      }
    );
  } catch (error) {
    log.log(
      "error",
      "NotificationService EmailConsumer consumeAuthEmailMessages() method error:",
      error
    );
  }
}

export async function consumeOrderEmailMessages(
  channel: Channel
): Promise<void> {
  try {
    if (!channel) {
      channel = (await createQueueConnection()) as Channel;
    }
    const exchangeName = "servicesconnect-order-notification";
    const routingKey = "order-email";
    const queueName = "order-email-queue";
    await channel.assertExchange(exchangeName, "direct");
    const servicesconnectQueue = await channel.assertQueue(queueName, {
      durable: true,
      autoDelete: false,
    });
    await channel.bindQueue(
      servicesconnectQueue.queue,
      exchangeName,
      routingKey
    );
    channel.consume(
      servicesconnectQueue.queue,
      async (msg: ConsumeMessage | null) => {
        const dto = JSON.parse(msg!.content.toString()) as SendEmailDTO;
        const locals: EmailLocals = {
          app_link: `${envConfig.client_url}`,
          app_icon: "https://i.ibb.co/Kyp2m0t/cover.png",
          username: dto.locals.username,
          sender: dto.locals.sender,
          offer_link: dto.locals.offer_link,
          amount: dto.locals.amount,
          buyer_username: dto.locals.buyer_username,
          seller_username: dto.locals.seller_username,
          title: dto.locals.title,
          description: dto.locals.description,
          delivery_days: dto.locals.delivery_days,
          order_id: dto.locals.order_id,
          order_due: dto.locals.order_due,
          requirements: dto.locals.requirements,
          order_url: dto.locals.order_url,
          original_date: dto.locals.original_date,
          new_date: dto.locals.new_date,
          reason: dto.locals.reason,
          subject: dto.locals.subject,
          header: dto.locals.header,
          type: dto.locals.type,
          message: dto.locals.message,
          service_fee: dto.locals.service_fee,
          total: dto.locals.total,
        };
        if (dto.template === "orderPlaced") {
          await sendEmail({
            template: "orderPlaced",
            receiver: dto.receiver,
            locals,
          });
          await sendEmail({
            template: "orderReceipt",
            receiver: dto.receiver,
            locals,
          });
        } else {
          await sendEmail({
            template: dto.template,
            receiver: dto.receiver,
            locals,
          });
        }
        channel.ack(msg!);
      }
    );
  } catch (error) {
    log.log(
      "error",
      "NotificationService EmailConsumer consumeOrderEmailMessages() method error:",
      error
    );
  }
}
