import * as Debug from "debug";
const debug = Debug("forgesdk.AzureNotificationBus");
import * as shortid from "shortid";

import { AzureAmqpSubscription } from "./AzureAmqpServiceBus.js";
import * as serviceBusBodyParser from "./serviceBusBodyParser";

import {
  IHeartbeatBus,
  EventPredicate,
  IHeartbeatBusOptions,
  MessagePriorities,
  ConnectionStatus
} from "./../notificationBusTypes";
import { toCamel } from "../../utils";
import { EventEmitter } from "events";
import { IAzureNotificationBusOptions } from "./AzureNotificationBus.js";

export class AzureHeartbeatBus extends EventEmitter implements IHeartbeatBus {
  private azureSubscriptions = new Array<AzureAmqpSubscription>();

  private _started = false;
  constructor(readonly options: IAzureNotificationBusOptions) {
    super();
    this.options = options;

    const topicName = options.notificationBusName;

    this.options.subscriptionOptions = this.options.subscriptionOptions || {
      DefaultMessageTimeToLive: "PT120S",
      AutoDeleteOnIdle: "PT5M"
    };

    const secondaryConnections = this.options.secondaryConnectionStrings || [];
    const allConnectionStrings = [
      this.options.connectionString,
      ...secondaryConnections
    ];

    for (const connectionString of allConnectionStrings) {
      const subscription = this.createSubscription(topicName, connectionString);

      this.azureSubscriptions.push(subscription);
    }
  }
  private createSubscription(topicName: string, connectionString: string) {
    const subscription = new AzureAmqpSubscription(
      connectionString,
      topicName,
      this.options.subscriptionName,
      this.options.subscriptionOptions
    );

    subscription.on("connectionError", (msg: any) =>
      this.onConnectionError(subscription, msg)
    );
    subscription.on("connectionSuccess", (msg: any) =>
      this.onConnectionSuccess(subscription)
    );

    return subscription;
  }

  private onConnectionSuccess(subscription: AzureAmqpSubscription) {
    debug("Connection success");

    this.emitConnectionStatusChanged({
      connected: true,
      name: subscription._amqpUrl
    });
  }

  private onConnectionError(subscription: AzureAmqpSubscription, err: Error) {
    debug("Connection error, retry after 10s", err);

    this.emitConnectionStatusChanged({
      connected: false,
      error: err,
      name: subscription._amqpUrl
    });

    if (!this._started) {
      return;
    }

    subscription.retryReconnecting();
  }

  private emitConnectionStatusChanged(msg: ConnectionStatus): void {
    this.emit("_connectionStatusChanged", msg);
  }
}
