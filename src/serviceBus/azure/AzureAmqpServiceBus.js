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
const debug = Debug("forgesdk.AzureAmqpSubscription");
const events_1 = require("events");
// see: http://azure.github.io/azure-sdk-for-node/azure-sb/latest/servicebusservice.js.html
const azure = require("azure");
const amqp10 = require("amqp10");
const AMQPClient = amqp10.Client;
const Policy = amqp10.Policy;
class AzureAmqpSubscription extends events_1.EventEmitter {
    constructor(azureBusUrl, topic, subscription, subscriptionOptions) {
        super();
        this.receiveWithPeekLock = false;
        const retryOperations = new azure.ExponentialRetryPolicyFilter();
        this.topic = topic;
        this.subscription = subscription;
        this.subscriptionOptions = subscriptionOptions || {};
        const serviceBus = azure
            .createServiceBusService(azureBusUrl);
        this.serviceBusService = serviceBus
            .withFilter(retryOperations);
        this._amqpUrl = this._createAmqpUrl(azureBusUrl);
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            debug(`Connecting to ${this._amqpUrl}...`);
            try {
                this.close().catch(() => { });
                yield this.createIfNotExists();
                this._amqpClient = new AMQPClient(Policy.ServiceBusTopic);
                yield this._amqpClient.connect(this._amqpUrl);
                const receiver = yield this._amqpClient.createReceiver(`${this.topic}/Subscriptions/${this.subscription}`);
                receiver.on("message", (message) => {
                    this.emitMessage(message);
                });
                // TODO Check... _amqpClient.on("error")...
                receiver.on("error", (e) => this.emitConnectionError(e));
                receiver.on("errorReceived", (e) => this.emitConnectionError(e));
                this.emitConnectionSuccess();
            }
            catch (err) {
                this.emitConnectionError(err);
            }
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            const client = this._amqpClient;
            this._amqpClient = undefined;
            this.stopReconnecting();
            if (client) {
                yield client.disconnect();
            }
        });
    }
    retryReconnecting() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._connectingTimer) {
                return;
            }
            this._connectingTimer = setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                this.stopReconnecting();
                yield this.connect();
            }), 10000);
        });
    }
    // options: {DefaultMessageTimeToLive : "PT10S",AutoDeleteOnIdle : "PT5M"}
    // note: PT10S=10seconds, PT5M=5minutes
    createIfNotExists() {
        return __awaiter(this, void 0, void 0, function* () {
            debug(`Checking subscription ${this.topic}/${this.subscription} ...`);
            const exists = yield this.exists();
            if (exists) {
                debug(`Subscription ${this.topic}/${this.subscription} already exists.`);
                return;
            }
            yield this._createSubscription();
        });
    }
    stopReconnecting() {
        if (this._connectingTimer) {
            clearTimeout(this._connectingTimer);
            this._connectingTimer = undefined;
        }
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
    _createSubscription() {
        debug(`Creating subscription ${this.topic}/${this.subscription} ...`, this.subscriptionOptions);
        return new Promise((resolve, reject) => {
            this.serviceBusService
                .createSubscription(this.topic, this.subscription, this.subscriptionOptions, (error) => {
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
        if (!azureBusUrl) {
            throw new Error("Invalid azure bus url");
        }
        try {
            const matchName = azureBusUrl.match(sasNameRegEx);
            if (!matchName) {
                throw new Error("Invalid azure bus url");
            }
            const sasName = matchName[1];
            const matchKey = azureBusUrl.match(sasKeyRegEx);
            if (!matchKey) {
                throw new Error("Invalid azure bus url");
            }
            const sasKey = matchKey[1];
            const matchHost = azureBusUrl.match(hostNameRegEx);
            if (!matchHost) {
                throw new Error("Invalid azure bus url");
            }
            const serviceBusHost = matchHost[1];
            return `amqps://${encodeURIComponent(sasName)}:${encodeURIComponent(sasKey)}@${serviceBusHost}`;
        }
        catch (e) {
            throw new Error("Invalid azure bus url");
        }
    }
    emitMessage(msg) {
        this.emit("message", msg);
    }
    emitConnectionError(msg) {
        this.emit("connectionError", msg);
    }
    emitConnectionSuccess() {
        this.emit("connectionSuccess");
    }
}
exports.AzureAmqpSubscription = AzureAmqpSubscription;
//# sourceMappingURL=AzureAmqpServiceBus.js.map