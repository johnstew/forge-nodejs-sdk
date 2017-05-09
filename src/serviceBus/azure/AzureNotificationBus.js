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
const debug = Debug("forgesdk.AzureNotificationBus");
const AzureAmqpServiceBus_js_1 = require("./AzureAmqpServiceBus.js");
const notificationBusTypes_1 = require("./../notificationBusTypes");
const utils_1 = require("../../utils");
const events_1 = require("events");
class AzureNotificationBus extends events_1.EventEmitter {
    constructor(options) {
        super();
        this._waitOnceListeners = new Set();
        this.azureSubscriptions = new Array();
        this._started = false;
        this.options = options;
        const topicName = options.notificationBusName;
        this.options.subscriptionOptions = this.options.subscriptionOptions || {
            DefaultMessageTimeToLive: "PT120S",
            AutoDeleteOnIdle: "PT5M"
        };
        const secondaryConnections = this.options.secondaryConnectionStrings || [];
        const allConnectionStrings = [this.options.connectionString, ...secondaryConnections];
        for (const p of notificationBusTypes_1.MessagePriorities.values) {
            const topicPriorityName = `${topicName}-${notificationBusTypes_1.MessagePriorities.toShortString(p)}`;
            for (const connectionString of allConnectionStrings) {
                const subscription = this.createSubscription(topicPriorityName, connectionString);
                this.azureSubscriptions.push(subscription);
            }
        }
    }
    startReceiving() {
        return __awaiter(this, void 0, void 0, function* () {
            this._started = true;
            for (const subscription of this.azureSubscriptions) {
                yield subscription.connect();
            }
        });
    }
    stopReceiving() {
        return __awaiter(this, void 0, void 0, function* () {
            this._started = false;
            for (const subscription of this.azureSubscriptions) {
                yield subscription.close();
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
    createSubscription(topicName, connectionString) {
        const subscription = new AzureAmqpServiceBus_js_1.AzureAmqpSubscription(connectionString, topicName, this.options.subscriptionName, this.options.subscriptionOptions);
        subscription.on("message", (msg) => this.onAzureMessage(msg));
        subscription.on("error", (msg) => this.emitError(msg));
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
    onAzureMessage(msg) {
        try {
            if (!msg
                || !msg.body
                || !msg.properties
                || !msg.properties.subject) {
                return;
            }
            // Parse body
            // try to read the body (and check if is serialized with .NET, int this case remove extra characters)
            // http://www.bfcamara.com/post/84113031238/send-a-message-to-an-azure-service-bus-queue-with
            //  "@\u0006string\b3http://schemas.microsoft.com/2003/10/Serialization/?\u000b{ \"a\": \"1\"}"
            const matches = msg.body.match(/({.*})/);
            if (matches || matches.length >= 1) {
                msg.body = JSON.parse(matches[0]);
                // azure use PascalCase, I prefer camelCase
                msg.body = utils_1.toCamel(msg.body);
                this.emitMessage(msg.properties.subject, msg.body);
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
            debug(`Checking listener ...`);
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
exports.AzureNotificationBus = AzureNotificationBus;
