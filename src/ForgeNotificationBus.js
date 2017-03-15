"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shortid = require("shortid");
const Debug = require("debug");
const debug = Debug("forgesdk.ForgeNotificationBus");
const RabbitMqNotificationBus_1 = require("./serviceBus/rabbitMq/RabbitMqNotificationBus");
const AzureNotificationBus_1 = require("./serviceBus/azure/AzureNotificationBus");
const utils_1 = require("./utils");
class ForgeNotificationBus {
    constructor(options) {
        options = Object.assign({}, options);
        options.notificationBusName = options.notificationBusName || "forge-ntf";
        // for compatibility with older sdk...
        if (!options.connectionString) {
            options.connectionString = options.url;
        }
        if (!options.connectionString) {
            throw new Error("Invalid configuration, connectionString cannot be empty");
        }
        this._options = options;
        if (options.connectionString.startsWith("amqp")) {
            options.queueName = options.queueName || "forge-ntf-sdk-" + shortid.generate();
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
    waitCommand(cmdId, successNotificationName, failedNotificationName, waitTimeout) {
        successNotificationName = successNotificationName || "CommandSuccessNotification";
        failedNotificationName = failedNotificationName || "CommandFailedNotification";
        if (!cmdId) {
            throw new Error("cmdId not defined");
        }
        debug(`Waiting for command ${cmdId}...`);
        const isSuccessCommand = (name, msg) => {
            if (name !== successNotificationName) {
                return false;
            }
            if (msg.commandId === cmdId && !msg.sagaInfo) {
                return true;
            }
            if (msg.sagaInfo &&
                msg.sagaInfo.originatorId === cmdId &&
                msg.sagaInfo.status === 2) {
                return true;
            }
            return false;
        };
        const isFailedCommand = (name, msg) => {
            if (name !== failedNotificationName) {
                return false;
            }
            if (msg.commandId === cmdId) {
                return true;
            }
            if (msg.sagaInfo &&
                msg.sagaInfo.originatorId === cmdId) {
                return true;
            }
            return false;
        };
        return this.waitOnce(isSuccessCommand, isFailedCommand, waitTimeout)
            .then((msg) => {
            debug(`Command ${cmdId} success.`);
            return msg;
        })
            .catch((e) => {
            const errorMsg = e.message || e.reason;
            debug(`Command ${cmdId} failed, ${errorMsg}.`, e);
            throw new Error(errorMsg);
        });
    }
}
exports.ForgeNotificationBus = ForgeNotificationBus;
