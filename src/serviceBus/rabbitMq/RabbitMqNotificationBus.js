"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const Debug = require("debug");
const debug = Debug("forgesdk.ForgeNotificationBus.RabbitMq");
const RabbitMqServiceBus_js_1 = require("./RabbitMqServiceBus.js");
const events_1 = require("events");
const utils_1 = require("../../utils");
class RabbitMqNotificationBus {
    constructor(options) {
        this._waitOnceListeners = new Set();
        this.options = options;
        this._eventEmitter = new events_1.EventEmitter();
        this.rabbitMqChannel = new RabbitMqServiceBus_js_1.RabbitMqChannel(this.options.url);
        this.options.queueOptions = this.options.queueOptions || {
            exclusive: true,
            durable: false,
            autoDelete: true
        };
    }
    startReceiving() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.rabbitMqChannel.connect();
            yield this.rabbitMqChannel
                .subscribeToExchange(this.options.notificationBusName, // exchange
            this.options.queueOptions, (msg) => this._dispatch(msg));
        });
    }
    on(eventName, listener) {
        this._eventEmitter.on(eventName, listener);
    }
    stopReceiving() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.rabbitMqChannel.close();
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
