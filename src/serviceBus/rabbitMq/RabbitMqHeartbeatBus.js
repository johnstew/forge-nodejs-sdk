"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Debug = require("debug");
const debug = Debug("forgesdk.ForgeNotificationBus.RabbitMq");
const RabbitMqChannel_js_1 = require("./RabbitMqChannel.js");
const events_1 = require("events");
const ExchangeForgeHeartbeat = "forge-heartbeats";
const QueueForgeHeartbeatPrefix = "forge-hbt";
class RabbitMqHeartbeatBus extends events_1.EventEmitter {
    constructor(options) {
        super();
        this.options = options;
        this.rabbitMqChannels = new Array();
        this._started = false;
        //const HeartbeatQueueName = `${QueueForgeHeartbeatPrefix}-sdk-${shortid.generate()}`;
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
        this.options.queueOptions = Object.assign({}, defaultQueueOptions, this.options.queueOptions);
        for (const connectionString of allConnectionStrings) {
            this.rabbitMqChannels.push(this.createChannel(connectionString));
        }
    }
    createChannel(connectionString) {
        const channel = new RabbitMqChannel_js_1.RabbitMqChannel(connectionString);
        channel.on("connectionError", (msg) => this.onConnectionError(channel, msg));
        channel.on("connectionSuccess", (msg) => this.onConnectionSuccess(channel));
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
    onConnectionSuccess(channel) {
        debug("Connection success");
        this.emitConnectionStatusChanged({
            connected: true,
            name: channel.URL
        });
    }
    onConnectionError(channel, err) {
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
    emitError(msg) {
        debug("error", msg);
        this.emit("error", msg);
    }
    emitConnectionStatusChanged(msg) {
        this.emit("_connectionStatusChanged", msg);
    }
}
exports.RabbitMqHeartbeatBus = RabbitMqHeartbeatBus;
//# sourceMappingURL=RabbitMqHeartbeatBus.js.map