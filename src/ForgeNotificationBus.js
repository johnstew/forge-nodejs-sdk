"use strict";

const debug = require("debug")("ForgeNotificationBus");
const RabbitMqBus = require("./ForgeNotificationBus.RabbitMq");
const AzureBus = require("./ForgeNotificationBus.Azure");

class ForgeNotificationBus {
	constructor(options){
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

	waitOnce(predicate){
		return this.bus.waitOnce(predicate);
	}

	waitCommand(cmdId, successNotificationName, failedNotification){
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

		return new Promise((resolve, reject) => {
			this.waitOnce(isSuccessCommand)
			.then((msg) => {
				debug(`Command ${cmdId} success.`);
				resolve(msg);
			});
			this.waitOnce(isFailedCommand)
			.then((msg) => {
				debug(`Command ${cmdId} failed, ${msg.reason}.`);
				reject(msg.reason);
			});
		});
	}

	waitDistributionPublish(entityTranslationId){
		return this.waitOnce((name, msg) => {
			return name === "EntityDistributionNotification" &&
				msg.action === "publish" &&
				msg.translationId === entityTranslationId;
		});
	}

	waitDistributionPublishByEntityId(entityId, culture){
		return this.waitOnce((name, msg) => {
			return name === "EntityDistributionNotification" &&
				msg.action === "publish" &&
				msg.entityId === entityId &&
				msg.translationInfo.culture === culture;
		});
	}
}

module.exports = ForgeNotificationBus;
