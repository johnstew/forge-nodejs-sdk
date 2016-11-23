"use strict";

const debug = require("debug")("ForgeNotificationBus");
const RabbitMqBus = require("./ForgeNotificationBus.RabbitMq");
const AzureBus = require("./ForgeNotificationBus.Azure");

class ForgeNotificationBus {
	constructor(options){
		this._options = options;
		this._options.defaultWaitOnceTimeout = this._options.defaultWaitOnceTimeout || 120000;

		if (options.url.startsWith("amqp")){
			this.bus = new RabbitMqBus(options);
		}
		else {
			this.bus = new AzureBus(options);
		}
	}

	startReceiving(){
		return this.bus.startReceiving();
	}

	on(notificationName, listener){
		return this.bus.on(notificationName, listener);
	}

	stopReceiving(){
		return this.bus.stopReceiving();
	}

	waitOnce(resolvePredicate, rejectPredicate, waitTimeout){
		waitTimeout = waitTimeout || this._options.defaultWaitOnceTimeout;

		let myPromise = this.bus.waitOnce(resolvePredicate, rejectPredicate);

		return this._withTimeout(myPromise, waitTimeout);
	}

	waitCommand(cmdId, successNotificationName, failedNotification, waitTimeout){
		successNotificationName = successNotificationName || "CommandSuccessNotification";
		failedNotification = failedNotification || "CommandFailedNotification";

		if (!cmdId) throw new Error("cmdId not defined");

		debug(`Waiting for command ${cmdId}...`);

		let isSuccessCommand = (name, msg) => {
			if (name !== successNotificationName) return false;

			if (msg.commandId === cmdId && !msg.sagaInfo) return true;

			if (msg.sagaInfo &&
				msg.sagaInfo.originatorId === cmdId &&
				msg.sagaInfo.status === 2) return true;

			return false;
		};
		let isFailedCommand = (name, msg) => {
			if (name !== failedNotification) return false;

			if (msg.commandId === cmdId) return true;

			if (msg.sagaInfo &&
				msg.sagaInfo.originatorId === cmdId) return true;

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

	waitDistributionPublish(entityTranslationId, waitTimeout){
		return this.waitOnce((name, msg) => {
			return name === "EntityDistributionNotification" &&
				msg.action === "publish" &&
				msg.translationId === entityTranslationId;
		}, null, waitTimeout);
	}

	waitDistributionPublishByEntityId(entityId, culture, waitTimeout){
		return this.waitOnce((name, msg) => {
			return name === "EntityDistributionNotification" &&
				msg.action === "publish" &&
				msg.entityId === entityId &&
				msg.translationInfo.culture === culture;
		}, null, waitTimeout);
	}

	_withTimeout(p, ms){
		let timeout = new Promise((resolve, reject) =>{
			let timeoutError = new Error("Timeout");
			timeoutError.isTimeout = true;

			let tId = setTimeout(reject, ms, timeoutError);
			let clearTimeoutFunc = () => clearTimeout(tId);
			p.then(clearTimeoutFunc, clearTimeoutFunc);
		});

		return Promise.race([p, timeout]);
	}
}

module.exports = ForgeNotificationBus;
