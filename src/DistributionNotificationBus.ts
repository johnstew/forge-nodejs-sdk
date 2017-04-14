import * as shortid from "shortid";
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
		options.notificationBusName = options.notificationBusName || "dist-ntf";

		// for compatibility with older sdk...
		if (!options.connectionString) {
			options.connectionString = (options as any).url;
		}

		if (!options.connectionString) {
			throw new Error("Invalid configuration, connectionString cannot be empty");
		}

		this._options = options;

		if (options.connectionString.startsWith("amqp")) {
			options.queueName = options.queueName || "dist-ntf-sdk-" + shortid.generate();
			this.bus = new RabbitMqNotificationBus(options);
		} else {
			options.subscriptionName = options.subscriptionName	|| "sdk-" + shortid.generate();
			this.bus = new AzureNotificationBus(options);
		}
	}

	startReceiving(): Promise<any> {
		return this.bus.startReceiving();
	}

	on(eventName: string, listener: (msg: any) => void): void {
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

	waitDistributionPublish(entityTranslationId: string, waitTimeout?: number) {
		return this.waitOnce((name, msg) => {
			return name === "EntityDistributionNotification" &&
				msg.action === "publish" &&
				msg.translationId === entityTranslationId;
		}, undefined, waitTimeout);
	}

	waitDistributionPublishByEntityId(entityId: string, culture: string, waitTimeout?: number) {
		return this.waitOnce((name, msg) => {
			return name === "EntityDistributionNotification" &&
				msg.action === "publish" &&
				msg.entityId === entityId &&
				msg.translationCulture === culture;
		}, undefined, waitTimeout);
	}
}
