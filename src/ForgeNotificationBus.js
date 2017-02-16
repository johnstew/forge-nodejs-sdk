"use strict";
const Debug = require("debug");
const debug = Debug("forgesdk.ForgeNotificationBus");
const ForgeNotificationBus_RabbitMq_1 = require("./ForgeNotificationBus.RabbitMq");
const ForgeNotificationBus_Azure_1 = require("./ForgeNotificationBus.Azure");
class ForgeNotificationBus {
    constructor(options) {
        this._options = options;
        this._options.defaultWaitOnceTimeout = this._options.defaultWaitOnceTimeout || 120000;
        if (options.url.startsWith("amqp")) {
            this.bus = new ForgeNotificationBus_RabbitMq_1.RabbitMqForgeNotificationBus(options);
        }
        else {
            this.bus = new ForgeNotificationBus_Azure_1.AzureForgeNotificationBus(options);
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
        waitTimeout = waitTimeout || this._options.defaultWaitOnceTimeout;
        let myPromise = this.bus.waitOnce(resolvePredicate, rejectPredicate);
        return this._withTimeout(myPromise, waitTimeout);
    }
    waitCommand(cmdId, successNotificationName, failedNotificationName, waitTimeout) {
        successNotificationName = successNotificationName || "CommandSuccessNotification";
        failedNotificationName = failedNotificationName || "CommandFailedNotification";
        if (!cmdId)
            throw new Error("cmdId not defined");
        debug(`Waiting for command ${cmdId}...`);
        let isSuccessCommand = (name, msg) => {
            if (name !== successNotificationName)
                return false;
            if (msg.commandId === cmdId && !msg.sagaInfo)
                return true;
            if (msg.sagaInfo &&
                msg.sagaInfo.originatorId === cmdId &&
                msg.sagaInfo.status === 2)
                return true;
            return false;
        };
        let isFailedCommand = (name, msg) => {
            if (name !== failedNotificationName)
                return false;
            if (msg.commandId === cmdId)
                return true;
            if (msg.sagaInfo &&
                msg.sagaInfo.originatorId === cmdId)
                return true;
            return false;
        };
        return this.waitOnce(isSuccessCommand, isFailedCommand, waitTimeout)
            .then((msg) => {
            debug(`Command ${cmdId} success.`);
            return msg;
        })
            .catch((e) => {
            let errorMsg = e.message || e.reason;
            debug(`Command ${cmdId} failed, ${errorMsg}.`, e);
            throw new Error(errorMsg);
        });
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
                msg.translationInfo.culture === culture;
        }, undefined, waitTimeout);
    }
    _withTimeout(p, ms) {
        let timeout = new Promise((resolve, reject) => {
            let timeoutError = new TimeoutError("Timeout");
            let tId = setTimeout(reject, ms, timeoutError);
            let clearTimeoutFunc = () => clearTimeout(tId);
            p.then(clearTimeoutFunc, clearTimeoutFunc);
        });
        return Promise.race([p, timeout]);
    }
}
exports.ForgeNotificationBus = ForgeNotificationBus;
class TimeoutError extends Error {
    constructor(msg) {
        super(msg);
        this.isTimeout = true;
    }
}
