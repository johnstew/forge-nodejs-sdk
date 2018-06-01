"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Debug = require("debug");
const debug = Debug("forgesdk.AzureNotificationBus");
const AzureAmqpServiceBus_js_1 = require("./AzureAmqpServiceBus.js");
const events_1 = require("events");
class AzureHeartbeatBus extends events_1.EventEmitter {
    constructor(options) {
        super();
        this.options = options;
        this.azureSubscriptions = new Array();
        this._started = false;
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
    createSubscription(topicName, connectionString) {
        const subscription = new AzureAmqpServiceBus_js_1.AzureAmqpSubscription(connectionString, topicName, this.options.subscriptionName, this.options.subscriptionOptions);
        subscription.on("connectionError", (msg) => this.onConnectionError(subscription, msg));
        subscription.on("connectionSuccess", (msg) => this.onConnectionSuccess(subscription));
        return subscription;
    }
    onConnectionSuccess(subscription) {
        debug("Connection success");
        this.emitConnectionStatusChanged({
            connected: true,
            name: subscription._amqpUrl
        });
    }
    onConnectionError(subscription, err) {
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
    emitConnectionStatusChanged(msg) {
        this.emit("_connectionStatusChanged", msg);
    }
}
exports.AzureHeartbeatBus = AzureHeartbeatBus;
//# sourceMappingURL=AzureHeartbeatBus.js.map