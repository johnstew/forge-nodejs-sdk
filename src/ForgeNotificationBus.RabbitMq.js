"use strict";
const Debug = require("debug");
const debug = Debug("forgesdk.ForgeNotificationBus.RabbitMq");
const RabbitMqServiceBus_js_1 = require("./RabbitMqServiceBus.js");
const events_1 = require("events");
class RabbitMqForgeNotificationBus {
    constructor(options) {
        this._waitOnceListeners = new Set();
        this.options = options;
        this._eventEmitter = new events_1.EventEmitter();
        this.rabbitMqChannel = new RabbitMqServiceBus_js_1.RabbitMqChannel(this.options.url);
    }
    startReceiving() {
        return this.rabbitMqChannel.connect()
            .then(() => {
            return this.rabbitMqChannel
                .subscribeToExchange("forgeNotifications", (msg) => this._dispatch(msg));
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
                let body = JSON.parse(msg.content.toString());
                this._emit(msg.properties.headers.TypeName, toCamel(body));
            }
        }
        catch (e) {
            this._emit("error", e);
        }
    }
    _emit(name, body) {
        debug(name, body);
        this._eventEmitter.emit(name, body);
        let listeners = this._waitOnceListeners;
        for (let item of listeners) {
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
    on(eventName, listener) {
        this._eventEmitter.on(eventName, listener);
    }
    stopReceiving() {
        this.rabbitMqChannel.close();
    }
    waitOnce(resolvePredicate, rejectPredicate) {
        return new Promise((resolve, reject) => {
            this._waitOnceListeners.add({
                resolvePredicate: resolvePredicate,
                rejectPredicate: rejectPredicate,
                resolve: resolve,
                reject: reject
            });
        });
    }
}
exports.RabbitMqForgeNotificationBus = RabbitMqForgeNotificationBus;
function toCamel(o) {
    var build, key, destKey, value;
    if (o instanceof Array) {
        build = [];
        for (key in o) {
            value = o[key];
            if (typeof value === "object") {
                value = toCamel(value);
            }
            build.push(value);
        }
    }
    else {
        build = {};
        for (key in o) {
            if (o.hasOwnProperty(key)) {
                destKey = (key.charAt(0).toLowerCase() + key.slice(1) || key).toString();
                value = o[key];
                if (value !== null && typeof value === "object") {
                    value = toCamel(value);
                }
                build[destKey] = value;
            }
        }
    }
    return build;
}
