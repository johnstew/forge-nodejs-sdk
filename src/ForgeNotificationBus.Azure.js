"use strict";
const AzureAmqpServiceBus_js_1 = require("./AzureAmqpServiceBus.js");
const uuid = require("uuid");
const azureServiceBus = require("./AzureServiceBus.js");
class AzureForgeNotificationBus {
    constructor(options) {
        this.options = options;
        this.options.topicName = this.options.topicName || "forgenotifications";
        this.options.subscriptionName = this.options.subscriptionName || "forge-sdk-" + uuid.v4();
        this.options.subscriptionOptions = this.options.subscriptionOptions || {
            DefaultMessageTimeToLive: "PT120S",
            AutoDeleteOnIdle: "PT5M"
        };
        this.options.useAmqp = this.options.hasOwnProperty("useAmqp")
            ? this.options.useAmqp
            : true;
        if (this.options.useAmqp) {
            this.azureSubscription =
                new AzureAmqpServiceBus_js_1.AzureAmqpSubscription(this.options.url, this.options.topicName, this.options.subscriptionName);
        }
        else {
            this.azureSubscription =
                new azureServiceBus.AzureSubscription(this.options.url, this.options.topicName, this.options.subscriptionName, this.options.receiveInterval, this.options.receiveTimeout);
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
        this.azureSubscription.stopReceiving();
    }
    waitOnce(resolvePredicate, rejectPredicate) {
        return this.azureSubscription.waitOnce(resolvePredicate, rejectPredicate);
    }
}
exports.AzureForgeNotificationBus = AzureForgeNotificationBus;
