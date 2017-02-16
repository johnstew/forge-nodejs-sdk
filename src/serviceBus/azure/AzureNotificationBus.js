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
const azureServiceBus = require("./AzureServiceBus.js");
class AzureNotificationBus {
    constructor(options) {
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
        if (this.options.useAmqp) {
            this.azureSubscription =
                new AzureAmqpServiceBus_js_1.AzureAmqpSubscription(this.options.url, topicName, subscriptionName);
        }
        else {
            this.azureSubscription =
                new azureServiceBus.AzureSubscription(this.options.url, topicName, subscriptionName, this.options.receiveInterval, this.options.receiveTimeout);
        }
    }
    startReceiving() {
        return this.azureSubscription
            .createIfNotExists(this.options.subscriptionOptions)
            .then(() => {
            return this.azureSubscription
                .startReceiving();
        });
    }
    on(eventName, listener) {
        this.azureSubscription.on(eventName, listener);
    }
    stopReceiving() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.azureSubscription.stopReceiving();
        });
    }
    waitOnce(resolvePredicate, rejectPredicate) {
        return this.azureSubscription.waitOnce(resolvePredicate, rejectPredicate);
    }
}
exports.AzureNotificationBus = AzureNotificationBus;
