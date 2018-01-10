"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Debug = require("debug");
const debug = Debug("forgesdk.ForgeNotificationBus.RabbitMq");
const RabbitMqChannel_js_1 = require("./RabbitMqChannel.js");
const events_1 = require("events");
const notificationBusTypes_1 = require("./../notificationBusTypes");
const utils_1 = require("../../utils");
class RabbitMqNotificationBus extends events_1.EventEmitter {
    constructor(options) {
        super();
        this.rabbitMqChannels = new Array();
        this._waitOnceListeners = new Set();
        this._started = false;
        this.options = options;
        const secondaryConnections = this.options.secondaryConnectionStrings || [];
        const allConnectionStrings = [this.options.connectionString, ...secondaryConnections];
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
    startReceiving() {
        return __awaiter(this, void 0, void 0, function* () {
            debug("Starting...");
            this._started = true;
            for (const channel of this.rabbitMqChannels) {
                yield channel.connect();
            }
        });
    }
    stopReceiving() {
        return __awaiter(this, void 0, void 0, function* () {
            debug("Stopping...");
            this._started = false;
            for (const channel of this.rabbitMqChannels) {
                yield channel.close();
            }
        });
    }
    waitOnce(resolvePredicate, rejectPredicate) {
        return new Promise((resolve, reject) => {
            this._waitOnceListeners.add({
                resolvePredicate,
                rejectPredicate,
                resolve,
                reject
            });
        });
    }
    createChannel(connectionString) {
        const channel = new RabbitMqChannel_js_1.RabbitMqChannel(connectionString);
        channel.on("message", (msg) => this.onRabbitMqMessage(msg));
        channel.on("error", (msg) => this.emitError(msg));
        channel.on("connectionError", (msg) => this.onConnectionError(channel, msg));
        channel.on("connectionSuccess", (msg) => this.onConnectionSuccess(channel));
        for (const p of notificationBusTypes_1.MessagePriorities.values) {
            const routingKey = notificationBusTypes_1.MessagePriorities.toShortString(p) + ".*";
            const queueName = this.options.queueName + "-" + notificationBusTypes_1.MessagePriorities.toShortString(p);
            channel.defineConsumer({
                queueName,
                queueOptions: this.options.queueOptions,
                bindings: [{
                        exchange: this.options.notificationBusName,
                        routingKey
                    }]
            });
        }
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
    onRabbitMqMessage(msg) {
        try {
            if (!msg) {
                return;
            }
            if (!msg.properties
                || !msg.properties.headers
                || !msg.properties.headers.TypeName) {
                throw new Error("Invalid message");
            }
            else {
                const body = JSON.parse(msg.content.toString());
                this.emitMessage(msg.properties.headers.TypeName, utils_1.toCamel(body));
            }
        }
        catch (e) {
            this.emitMessage("error", e);
        }
    }
    emitMessage(name, body) {
        debug(name, body);
        this.emit(name, body);
        const listeners = this._waitOnceListeners;
        for (const item of listeners) {
            if (item.resolvePredicate && item.resolvePredicate(name, body)) {
                item.resolve(body);
                listeners.delete(item);
            }
            else if (item.rejectPredicate && item.rejectPredicate(name, body)) {
                item.reject(body);
                listeners.delete(item);
            }
        }
    }
    emitError(msg) {
        debug("error", msg);
        this.emit("error", msg);
    }
    emitConnectionStatusChanged(msg) {
        this.emit("_connectionStatusChanged", msg);
    }
}
exports.RabbitMqNotificationBus = RabbitMqNotificationBus;
//# sourceMappingURL=RabbitMqNotificationBus.js.map