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
        for (const p of notificationBusTypes_1.MessagePriorities.values) {
            var priority = notificationBusTypes_1.MessagePriority[p];
            const topicPriorityName = `${topicName}-${notificationBusTypes_1.MessagePriorities.toShortString(p)}`;
            let subscription;
            if (this.options.useAmqp) {
                subscription =
                    new AzureAmqpServiceBus_js_1.AzureAmqpSubscription(this.options.url, topicPriorityName, options.subscriptionName);
            }
            else {
                subscription =
                    new azureServiceBus.AzureSubscription(this.options.url, topicPriorityName, options.subscriptionName, this.options.receiveInterval, this.options.receiveTimeout);
            }
            this.azureSubscriptions.push(subscription);
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
}
exports.AzureNotificationBus = AzureNotificationBus;
