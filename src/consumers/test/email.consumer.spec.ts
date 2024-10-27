import * as connection from "@notifications/config/amqp";
import amqp from "amqplib";
import {
  consumeAuthEmailMessages,
  consumeOrderEmailMessages,
} from "@notifications/consumers/email.consumer";

jest.mock("@notifications/config/amqp");
jest.mock("amqplib");

describe("Email Consumer", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("consumeAuthEmailMessages method", () => {
    it("should be called", async () => {
      const channel = {
        assertExchange: jest.fn(),
        publish: jest.fn(),
        assertQueue: jest.fn(),
        bindQueue: jest.fn(),
        consume: jest.fn(),
      };
      jest.spyOn(channel, "assertExchange");
      jest.spyOn(channel, "assertQueue").mockReturnValue({
        queue: "auth-email-queue",
        messageCount: 0,
        consumerCount: 0,
      });
      jest
        .spyOn(connection, "createQueueConnection")
        .mockReturnValue(channel as never);
      const connectionChannel: amqp.Channel | undefined =
        await connection.createQueueConnection();
      await consumeAuthEmailMessages(connectionChannel!);
      expect(connectionChannel!.assertExchange).toHaveBeenCalledWith(
        "servicesconnect-auth-notification",
        "direct"
      );
      expect(connectionChannel!.assertQueue).toHaveBeenCalledTimes(1);
      expect(connectionChannel!.consume).toHaveBeenCalledTimes(1);
      expect(connectionChannel!.bindQueue).toHaveBeenCalledWith(
        "auth-email-queue",
        "servicesconnect-auth-notification",
        "auth-email"
      );
    });
  });

  describe("consumeOrderEmailMessages method", () => {
    it("should be called", async () => {
      const channel = {
        assertExchange: jest.fn(),
        publish: jest.fn(),
        assertQueue: jest.fn(),
        bindQueue: jest.fn(),
        consume: jest.fn(),
      };
      jest.spyOn(channel, "assertExchange");
      jest.spyOn(channel, "assertQueue").mockReturnValue({
        queue: "order-email-queue",
        messageCount: 0,
        consumerCount: 0,
      });
      jest
        .spyOn(connection, "createQueueConnection")
        .mockReturnValue(channel as never);
      const connectionChannel: amqp.Channel | undefined =
        await connection.createQueueConnection();
      await consumeOrderEmailMessages(connectionChannel!);
      expect(connectionChannel!.assertExchange).toHaveBeenCalledWith(
        "servicesconnect-order-notification",
        "direct"
      );
      expect(connectionChannel!.assertQueue).toHaveBeenCalledTimes(1);
      expect(connectionChannel!.consume).toHaveBeenCalledTimes(1);
      expect(connectionChannel!.bindQueue).toHaveBeenCalledWith(
        "order-email-queue",
        "servicesconnect-order-notification",
        "order-email"
      );
    });
  });
});
