import * as Debug from "debug";
const debug = Debug("forgesdk.ForgeNotificationBus");

import {RabbitMqForgeNotificationBus} from "./ForgeNotificationBus.RabbitMq";
import {AzureForgeNotificationBus} from "./ForgeNotificationBus.Azure";
import {INotificationBus, EventPredicate} from "./ForgeNotificationBusTypes";

export class ForgeNotificationBus {
	readonly _options: any;
	readonly bus: INotificationBus;

	constructor(options: any){
		this._options = options;
		this._options.defaultWaitOnceTimeout = this._options.defaultWaitOnceTimeout || 120000;

		if (options.url.startsWith("amqp")){
			this.bus = new RabbitMqForgeNotificationBus(options);
		}
		else {
			this.bus = new AzureForgeNotificationBus(options);
		}
	}

	startReceiving(): Promise<any>{
		return this.bus.startReceiving();
	}

	on(eventName: string, listener: Function): void{
		return this.bus.on(eventName, listener);
	}

	stopReceiving(): void{
		return this.bus.stopReceiving();
	}

	waitOnce(resolvePredicate: EventPredicate, rejectPredicate?: EventPredicate, waitTimeout?: number){
		waitTimeout = waitTimeout || this._options.defaultWaitOnceTimeout;

		let myPromise = this.bus.waitOnce(resolvePredicate, rejectPredicate);

		return this._withTimeout(myPromise, waitTimeout);
	}

	waitCommand(cmdId: string, successNotificationName: string, failedNotificationName: string, waitTimeout?: number){
		successNotificationName = successNotificationName || "CommandSuccessNotification";
		failedNotificationName = failedNotificationName || "CommandFailedNotification";

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
			if (name !== failedNotificationName) return false;

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

	waitDistributionPublish(entityTranslationId, waitTimeout?: number){
		return this.waitOnce((name, msg) => {
			return name === "EntityDistributionNotification" &&
				msg.action === "publish" &&
				msg.translationId === entityTranslationId;
		}, undefined, waitTimeout);
	}

	waitDistributionPublishByEntityId(entityId, culture, waitTimeout?: number){
		return this.waitOnce((name, msg) => {
			return name === "EntityDistributionNotification" &&
				msg.action === "publish" &&
				msg.entityId === entityId &&
				msg.translationInfo.culture === culture;
		}, undefined, waitTimeout);
	}

	_withTimeout(p, ms){
		let timeout = new Promise((resolve, reject) =>{
			let timeoutError = new TimeoutError("Timeout");

			let tId = setTimeout(reject, ms, timeoutError);
			let clearTimeoutFunc = () => clearTimeout(tId);
			p.then(clearTimeoutFunc, clearTimeoutFunc);
		});

		return Promise.race([p, timeout]);
	}
}

class TimeoutError extends Error {
	readonly isTimeout = true;

	constructor(msg: string) {
		super(msg);
	}
}
