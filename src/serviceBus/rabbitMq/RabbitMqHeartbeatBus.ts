import * as shortid from "shortid";

import * as Debug from "debug";
const debug = Debug("forgesdk.ForgeNotificationBus.RabbitMq");
import { RabbitMqChannel } from "./RabbitMqChannel.js";

import {
  IHeartbeatBus,
  EventPredicate,
  IHeartbeatBusOptions,
  MessagePriorities,
  ConnectionStatus
} from "./../notificationBusTypes";
import { toCamel } from "../../utils";
import { IRabbitMqNotificationBusOptions } from "./RabbitMqNotificationBus.js";
import { EventEmitter } from "events";

const ExchangeForgeHeartbeat = "forge-heartbeats";

const QueueForgeHeartbeatPrefix = "forge-hbt";

export class RabbitMqHeartbeatBus extends EventEmitter
  implements IHeartbeatBus {
  start(): void {
    for (const channel of this.rabbitMqChannels) {
      channel.publishHeartbeat();
    }
  }
  readonly rabbitMqChannels = new Array<RabbitMqChannel>();
  private _started = false;
  constructor(readonly options: IRabbitMqNotificationBusOptions) {
    super();
    const secondaryConnections = this.options.secondaryConnectionStrings || [];
    const allConnectionStrings = [
      this.options.connectionString,
      ...secondaryConnections
    ];

    const defaultQueueOptions = {
      exclusive: true,
      durable: false,
      autoDelete: true
    };

    this.options.queueOptions = {
      ...defaultQueueOptions,
      ...this.options.queueOptions
    };

    for (const connectionString of allConnectionStrings) {
      this.rabbitMqChannels.push(this.createChannel(connectionString));
    }
  }

  private createChannel(connectionString: string): RabbitMqChannel {
    const channel = new RabbitMqChannel(connectionString);
    channel.on("connectionError", (msg: any) =>
      this.onConnectionError(channel, msg)
    );
    channel.on("connectionSuccess", (msg: any) =>
      this.onConnectionSuccess(channel)
    );
    channel.defineConsumer({
      queueName: this.options.queueName,
      queueOptions: this.options.queueOptions,
      bindings: [
        {
          exchange: this.options.notificationBusName,
          routingKey: "*"
        }
      ]
    });
    return channel;
  }

  private onConnectionSuccess(channel: RabbitMqChannel) {
    debug("Connection success");

    this.emitConnectionStatusChanged({
      connected: true,
      name: channel.URL
    });
  }

  private onConnectionError(channel: RabbitMqChannel, err: Error) {
    debug("Connection error, retry after 10s", err);

    this.emitConnectionStatusChanged({
      connected: false,
      error: err,
      name: channel.URL
    });

    if (!this._started) {
      return;
    }

    channel.retryReconnecting();
  }

  private emitError(msg: Error): void {
    debug("error", msg);
    this.emit("error", msg);
  }

  private emitConnectionStatusChanged(msg: ConnectionStatus): void {
    this.emit("_connectionStatusChanged", msg);
  }
}
