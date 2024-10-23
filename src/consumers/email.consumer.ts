import { createQueueConnection, winstonLogger } from "@notifications/config";
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
        console.log(JSON.parse(msg!.content.toString()));

        // send emails
        // acknowledge
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
        console.log(JSON.parse(msg!.content.toString()));

        // send emails
        // acknowledge
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
