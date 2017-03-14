"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shortid = require("shortid");
const Debug = require("debug");
const debug = Debug("forgesdk.ForgeDistributionNotificationBus");
const RabbitMqNotificationBus_1 = require("./serviceBus/rabbitMq/RabbitMqNotificationBus");
const AzureNotificationBus_1 = require("./serviceBus/azure/AzureNotificationBus");
const utils_1 = require("./utils");
class DistributionNotificationBus {
    constructor(options) {
        options = Object.assign({}, options);
        options.notificationBusName = options.notificationBusName || "dist-ntf";
        if (!options.connectionString) {
            options.connectionString = options.url;
        }
        if (!options.connectionString) {
            throw new Error("Invalid configuration, connectionString cannot be empty");
        }
        this._options = options;
        if (options.connectionString.startsWith("amqp")) {
            options.queueName = options.queueName || "dist-ntf-sdk-" + shortid.generate();
            this.bus = new RabbitMqNotificationBus_1.RabbitMqNotificationBus(options);
        }
        else {
            options.subscriptionName = options.subscriptionName || "sdk-" + shortid.generate();
            this.bus = new AzureNotificationBus_1.AzureNotificationBus(options);
        }
    }
    startReceiving() {
        return this.bus.startReceiving();
    }
    on(eventName, listener) {
        return this.bus.on(eventName, listener);
    }
    stopReceiving() {
        return this.bus.stopReceiving();
    }
    waitOnce(resolvePredicate, rejectPredicate, waitTimeout) {
        const msWaitTimeout = waitTimeout
            || this._options.defaultWaitOnceTimeout
            || 120000;
        const myPromise = this.bus.waitOnce(resolvePredicate, rejectPredicate);
        return utils_1.withTimeout(myPromise, msWaitTimeout);
    }
    waitDistributionPublish(entityTranslationId, waitTimeout) {
        return this.waitOnce((name, msg) => {
            return name === "EntityDistributionNotification" &&
                msg.action === "publish" &&
                msg.translationId === entityTranslationId;
        }, undefined, waitTimeout);
    }
    waitDistributionPublishByEntityId(entityId, culture, waitTimeout) {
        return this.waitOnce((name, msg) => {
            return name === "EntityDistributionNotification" &&
                msg.action === "publish" &&
                msg.entityId === entityId &&
                msg.translationCulture === culture;
        }, undefined, waitTimeout);
    }
}
exports.DistributionNotificationBus = DistributionNotificationBus;
