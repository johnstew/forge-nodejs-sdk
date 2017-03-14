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
const AzureAmqpServiceBus_js_1 = require("./AzureAmqpServiceBus.js");
const notificationBusTypes_1 = require("./../notificationBusTypes");
const azureServiceBus = require("./AzureServiceBus.js");
class AzureNotificationBus {
    constructor(options) {
        this.azureSubscriptions = new Array();
        this.options = options;
        const topicName = options.notificationBusName;
        this.options.subscriptionOptions = this.options.subscriptionOptions || {
            DefaultMessageTimeToLive: "PT120S",
            AutoDeleteOnIdle: "PT5M"
        };
        this.options.useAmqp = this.options.hasOwnProperty("useAmqp")
            ? this.options.useAmqp
            : true;
        const secondaryConnections = this.options.secondaryConnectionStrings || [];
        const allConnectionStrings = [this.options.connectionString, ...secondaryConnections];
        for (const p of notificationBusTypes_1.MessagePriorities.values) {
            var priority = notificationBusTypes_1.MessagePriority[p];
            const topicPriorityName = `${topicName}-${notificationBusTypes_1.MessagePriorities.toShortString(p)}`;
            for (const connectionString of allConnectionStrings) {
                const subscription = this.createSubscription(topicPriorityName, connectionString);
                this.azureSubscriptions.push(subscription);
            }
        }
    }
    startReceiving() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const subscription of this.azureSubscriptions) {
                yield subscription.createIfNotExists(this.options.subscriptionOptions);
                yield subscription.startReceiving();
            }
        });
    }
    on(eventName, listener) {
        for (const subscription of this.azureSubscriptions) {
            subscription.on(eventName, listener);
        }
    }
    stopReceiving() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const subscription of this.azureSubscriptions) {
                yield subscription.stopReceiving();
            }
        });
    }
    waitOnce(resolvePredicate, rejectPredicate) {
        return __awaiter(this, void 0, void 0, function* () {
            const promises = new Array();
            for (const subscription of this.azureSubscriptions) {
                promises.push(subscription.waitOnce(resolvePredicate, rejectPredicate));
            }
            return Promise.race(promises);
        });
    }
    createSubscription(topicName, connectionString) {
        if (this.options.useAmqp) {
            return new AzureAmqpServiceBus_js_1.AzureAmqpSubscription(connectionString, topicName, this.options.subscriptionName);
        }
        else {
            return new azureServiceBus.AzureSubscription(connectionString, topicName, this.options.subscriptionName, this.options.receiveInterval, this.options.receiveTimeout);
        }
    }
}
exports.AzureNotificationBus = AzureNotificationBus;
