import * as Debug from "debug";
const debug = Debug("forgesdk.ForgeDistributionNotificationBus");

import {RabbitMqNotificationBus, IRabbitMqNotificationBusOptions} from "./serviceBus/rabbitMq/RabbitMqNotificationBus";
import {AzureNotificationBus, IAzureNotificationBusOptions} from "./serviceBus/azure/AzureNotificationBus";
import {INotificationBus, EventPredicate, INotificationBusOptions} from "./serviceBus/notificationBusTypes";

import {withTimeout} from "./utils";

export interface IDistributionNotificationBusOptions
	extends INotificationBusOptions, IRabbitMqNotificationBusOptions, IAzureNotificationBusOptions {

	defaultWaitOnceTimeout?: number;
}

export class DistributionNotificationBus {
	readonly _options: IDistributionNotificationBusOptions;
	readonly bus: INotificationBus;
	readonly defaultWaitOnceTimeout: number;

	constructor(options: IDistributionNotificationBusOptions) {
		options = Object.assign({}, options);
		options.notificationBusName = options.notificationBusName || "distnotifications";

		this._options = options;

		if (options.url.startsWith("amqp")) {
			this.bus = new RabbitMqNotificationBus(options);
		} else {
			this.bus = new AzureNotificationBus(options);
		}
	}

	startReceiving(): Promise<any> {
		return this.bus.startReceiving();
	}

	on(eventName: string, listener: Function): void {
		return this.bus.on(eventName, listener);
	}

	stopReceiving(): Promise<any> {
		return this.bus.stopReceiving();
	}

	waitOnce(resolvePredicate: EventPredicate, rejectPredicate?: EventPredicate, waitTimeout?: number) {
		const msWaitTimeout = waitTimeout
			|| this._options.defaultWaitOnceTimeout
			|| 120000;

		const myPromise = this.bus.waitOnce(resolvePredicate, rejectPredicate);

		return withTimeout(myPromise, msWaitTimeout);
	}

	waitDistributionPublish(entityTranslationId, waitTimeout?: number) {
		return this.waitOnce((name, msg) => {
			return name === "EntityDistributionNotification" &&
				msg.action === "publish" &&
				msg.translationId === entityTranslationId;
		}, undefined, waitTimeout);
	}

	waitDistributionPublishByEntityId(entityId, culture, waitTimeout?: number) {
		return this.waitOnce((name, msg) => {
			return name === "EntityDistributionNotification" &&
				msg.action === "publish" &&
				msg.entityId === entityId &&
				msg.translationInfo.culture === culture;
		}, undefined, waitTimeout);
	}
}
