"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const AzureAmqpServiceBus_js_1 = require("./AzureAmqpServiceBus.js");
const uuid = require("uuid");
const notificationBusTypes_1 = require("./../notificationBusTypes");
const azureServiceBus = require("./AzureServiceBus.js");
class AzureNotificationBus {
    constructor(options) {
        this.azureSubscriptions = new Map();
        this.options = options;
        const topicName = options.notificationBusName;
        const subscriptionName = options.subscriptionName || "forge-sdk-" + uuid.v4();
        this.options.subscriptionOptions = this.options.subscriptionOptions || {
            DefaultMessageTimeToLive: "PT120S",
            AutoDeleteOnIdle: "PT5M"
        };
        this.options.useAmqp = this.options.hasOwnProperty("useAmqp")
            ? this.options.useAmqp
            : true;
        for (const p of notificationBusTypes_1.MessagePriorities) {
            var priority = notificationBusTypes_1.MessagePriority[p];
            const topicPriorityName = priority + "_" + topicName;
            let subscription;
            if (this.options.useAmqp) {
                subscription =
                    new AzureAmqpServiceBus_js_1.AzureAmqpSubscription(this.options.url, topicPriorityName, subscriptionName);
            }
            else {
                subscription =
                    new azureServiceBus.AzureSubscription(this.options.url, topicPriorityName, subscriptionName, this.options.receiveInterval, this.options.receiveTimeout);
            }
            this.azureSubscriptions.set(p, subscription);
        }
    }
    startReceiving() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const p of notificationBusTypes_1.MessagePriorities) {
                var subscription = this.azureSubscriptions.get(p);
                if (subscription) {
                    yield subscription.createIfNotExists(this.options.subscriptionOptions);
                    yield subscription.startReceiving();
                }
            }
        });
    }
    on(eventName, listener) {
        for (const p of notificationBusTypes_1.MessagePriorities) {
            var subscription = this.azureSubscriptions.get(p);
            if (subscription) {
                subscription.on(eventName, listener);
            }
        }
    }
    stopReceiving() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const p of notificationBusTypes_1.MessagePriorities) {
                var subscription = this.azureSubscriptions.get(p);
                if (subscription) {
                    yield subscription.stopReceiving();
                }
            }
        });
    }
    waitOnce(resolvePredicate, rejectPredicate) {
        return __awaiter(this, void 0, void 0, function* () {
            const promises = new Array();
            for (const p of notificationBusTypes_1.MessagePriorities) {
                var subscription = this.azureSubscriptions.get(p);
                if (subscription) {
                    promises.push(subscription.waitOnce(resolvePredicate, rejectPredicate));
                }
            }
            return Promise.race(promises);
        });
    }
}
exports.AzureNotificationBus = AzureNotificationBus;
