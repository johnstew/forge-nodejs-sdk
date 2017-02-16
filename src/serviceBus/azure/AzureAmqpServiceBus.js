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
const debug = Debug("forgesdk.azureAmqpServiceBus");
const debugTracking = Debug("forgesdk.azureAmqpServiceBus.tracking");
const events_1 = require("events");
// see: http://azure.github.io/azure-sdk-for-node/azure-sb/latest/servicebusservice.js.html
const azure = require("azure");
const utils_1 = require("../../utils");
const amqp10 = require("amqp10");
const AMQPClient = amqp10.Client;
const Policy = amqp10.Policy;
class AzureAmqpSubscription {
    constructor(azureBusUrl, topic, subscription) {
        this._waitOnceListeners = new Set();
        this.receiving = false;
        this.receiveWithPeekLock = false;
        this._eventEmitter = new events_1.EventEmitter();
        const retryOperations = new azure.ExponentialRetryPolicyFilter();
        this.topic = topic;
        this.subscription = subscription;
        const serviceBus = azure
            .createServiceBusService(azureBusUrl);
        this.serviceBusService = serviceBus
            .withFilter(retryOperations);
        this._amqpUrl = this._createAmqpUrl(azureBusUrl);
    }
    // options: {DefaultMessageTimeToLive : "PT10S",AutoDeleteOnIdle : "PT5M"}
    // note: PT10S=10seconds, PT5M=5minutes
    createIfNotExists(options) {
        return __awaiter(this, void 0, void 0, function* () {
            options = options || {};
            debug(`Checking subscription ${this.topic}/${this.subscription} ...`);
            const exists = yield this.exists();
            if (exists) {
                debug(`Subscription ${this.topic}/${this.subscription} already exists.`);
                return;
            }
            yield this._createSubscription(options);
        });
    }
    exists() {
        return new Promise((resolve, reject) => {
            this.serviceBusService
                .getSubscription(this.topic, this.subscription, (error) => {
                if (error) {
                    if (error.statusCode === 404) {
                        return resolve(false);
                    }
                    return reject(error);
                }
                resolve(true);
            });
        });
    }
    on(eventName, listener) {
        this._eventEmitter.on(eventName, listener);
    }
    startReceiving() {
        if (this.receiving) {
            return Promise.resolve(true);
        }
        debug("Start receiving messages with amqp protocol...");
        this.receiving = true;
        this._amqpClient = new AMQPClient(Policy.ServiceBusTopic);
        return this._amqpClient.connect(this._amqpUrl)
            .then(() => {
            return this._amqpClient.createReceiver(`${this.topic}/Subscriptions/${this.subscription}`);
        })
            .then((receiver) => {
            receiver.on("message", (message) => {
                this._receiveMessage(message);
            });
            receiver.on("errorReceived", (e) => this._emit("error", e));
        });
    }
    stopReceiving() {
        return __awaiter(this, void 0, void 0, function* () {
            this.receiving = false;
            debug("Stop receiving messages.");
            if (this._amqpClient) {
                yield this._amqpClient.disconnect();
            }
            this._amqpClient = null;
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
    _normalizeBody(body) {
        // azure use PascalCase, I prefer camelCase
        return utils_1.toCamel(body);
    }
    _emit(name, body) {
        debug(name, body);
        if (name === "CommandSuccessNotification") {
            debugTracking(`... ${body.commandId} OK`);
        }
        if (name === "CommandFailedNotification") {
            debugTracking(`... ${body.commandId} FAIL`);
        }
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
    _createSubscription(options) {
        return new Promise((resolve, reject) => {
            this.serviceBusService
                .createSubscription(this.topic, this.subscription, options, (error) => {
                if (error) {
                    return reject(error);
                }
                debug(`Subscription ${this.topic}/${this.subscription} created.`);
                resolve();
            });
        });
    }
    _createAmqpUrl(azureBusUrl) {
        const hostNameRegEx = /sb\:\/\/(.*?)\;/;
        const sasNameRegEx = /SharedAccessKeyName=(.*?)(\;|$)/;
        const sasKeyRegEx = /SharedAccessKey=(.*?)(\;|$)/;
        try {
            const sasName = azureBusUrl.match(sasNameRegEx)[1];
            const sasKey = azureBusUrl.match(sasKeyRegEx)[1];
            const serviceBusHost = azureBusUrl.match(hostNameRegEx)[1];
            return `amqps://${encodeURIComponent(sasName)}:${encodeURIComponent(sasKey)}@${serviceBusHost}`;
        }
        catch (e) {
            throw new Error("Invalid azure bus url");
        }
    }
    _receiveMessage(msg) {
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
            msg.body = this._normalizeBody(msg.body);
            this._emit(msg.properties.subject, msg.body);
        }
    }
    _deleteMessage(message) {
        return new Promise((resolve, reject) => {
            this.serviceBusService
                .deleteMessage(message, (error) => {
                if (error) {
                    return reject(error);
                }
                return resolve(true);
            });
        });
    }
}
exports.AzureAmqpSubscription = AzureAmqpSubscription;
