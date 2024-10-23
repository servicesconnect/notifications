import "express-async-errors";
import http from "http";
import { Logger } from "winston";
import { Application } from "express";
import { Channel } from "amqplib";

import { envConfig, winstonLogger } from "@notifications/config";
import { startAndCheckElasticConnection } from "@notifications/config";
import { createQueueConnection } from "@notifications/config";
import {
  consumeAuthEmailMessages,
  consumeOrderEmailMessages,
} from "./consumers/email.consumer";

const log: Logger = winstonLogger("notificationServer", "debug");

export function start(app: Application): void {
  startServer(app);
  startAndCheckElasticConnection();
  startQueues();
}

async function startQueues(): Promise<void> {
  const channel = await createQueueConnection();

  await consumeAuthEmailMessages(<Channel>channel);
  await consumeOrderEmailMessages(<Channel>channel);
}

function startServer(app: Application): void {
  try {
    const httpServer: http.Server = new http.Server(app);
    log.info(
      `Worker with process id of ${process.pid} on notification server has started`
    );
    httpServer.listen(envConfig.port, () => {
      log.info(`Notification server running on port ${envConfig.port}`);
    });
  } catch (error) {
    log.log("error", "NotificationService startServer() method:", error);
  }
}
