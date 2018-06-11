import * as shortid from "shortid";

import {
  RabbitMqNotificationBus,
  IRabbitMqNotificationBusOptions
} from "./serviceBus/rabbitMq/RabbitMqNotificationBus";
import {
  AzureNotificationBus,
  IAzureNotificationBusOptions
} from "./serviceBus/azure/AzureNotificationBus";
import {
  IHeartbeatBus,
  EventPredicate,
  IHeartbeatBusOptions
} from "./serviceBus/notificationBusTypes";

import { withTimeout } from "./utils";
import { RabbitMqHeartbeatBus } from "./serviceBus/rabbitMq/RabbitMqHeartbeatBus";
import { AzureHeartbeatBus } from "./serviceBus/azure/AzureHeartbeatBus";

export interface IForgeHeartbeatBus
  extends IHeartbeatBusOptions,
    IRabbitMqNotificationBusOptions,
    IAzureNotificationBusOptions {
  defaultWaitOnceTimeout?: number;
}

export class HeartbeatBus {
  readonly _options: IForgeHeartbeatBus;
  readonly bus: IHeartbeatBus;

  constructor(options: IForgeHeartbeatBus) {
    options = { ...options };
    options.notificationBusName = options.notificationBusName || "dist-ntf";

    // for compatibility with older sdk...
    if (!options.connectionString) {
      options.connectionString = (options as any).url;
    }

    if (!options.connectionString) {
      throw new Error(
        "Invalid configuration, connectionString cannot be empty"
      );
    }

    this._options = options;

    if (options.connectionString.startsWith("amqp")) {
      options.queueName =
        options.queueName || "forge-heartbeats-sdk-" + shortid.generate();
      this.bus = new RabbitMqHeartbeatBus(options);
    } else {
      options.subscriptionName =
        options.subscriptionName ||
        "forge-heartbeats-sdk-" + shortid.generate();
      this.bus = new AzureHeartbeatBus(options);
    }
    this.bus.start();
  }
}
