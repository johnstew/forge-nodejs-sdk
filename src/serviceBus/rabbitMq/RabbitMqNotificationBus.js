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
const RabbitMqServiceBus_js_1 = require("./RabbitMqServiceBus.js");
const events_1 = require("events");
const notificationBusTypes_1 = require("./../notificationBusTypes");
const utils_1 = require("../../utils");
class RabbitMqNotificationBus {
    constructor(options) {
        this.rabbitMqChannels = new Array();
        this._waitOnceListeners = new Set();
        this.options = options;
        this._eventEmitter = new events_1.EventEmitter();
        const secondaryConnections = this.options.secondaryConnectionStrings || [];
        const allConnectionStrings = [this.options.connectionString, ...secondaryConnections];
        for (const connectionString of allConnectionStrings) {
            const channel = new RabbitMqServiceBus_js_1.RabbitMqChannel(connectionString);
            this.rabbitMqChannels.push(channel);
        }
        this.options.queueOptions = this.options.queueOptions || {
            exclusive: true,
            durable: false,
            autoDelete: true
        };
    }
    startReceiving() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const channel of this.rabbitMqChannels) {
                yield channel.connect();
                for (const p of notificationBusTypes_1.MessagePriorities.values) {
                    const routingKey = notificationBusTypes_1.MessagePriorities.toShortString(p) + ".*";
                    const queueName = this.options.queueName + "-" + notificationBusTypes_1.MessagePriorities.toShortString(p);
                    yield channel.consume(this.options.notificationBusName, this.options.queueOptions, (msg) => this._dispatch(msg), routingKey, queueName);
                }
            }
        });
    }
    on(eventName, listener) {
        this._eventEmitter.on(eventName, listener);
    }
    stopReceiving() {
        return __awaiter(this, void 0, void 0, function* () {
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
    _dispatch(msg) {
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
                this._emit(msg.properties.headers.TypeName, utils_1.toCamel(body));
            }
        }
        catch (e) {
            this._emit("error", e);
        }
    }
    _emit(name, body) {
        debug(name, body);
        this._eventEmitter.emit(name, body);
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
}
exports.RabbitMqNotificationBus = RabbitMqNotificationBus;
