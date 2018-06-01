import * as shortid from "shortid";

import {RabbitMqNotificationBus, IRabbitMqNotificationBusOptions} from "./serviceBus/rabbitMq/RabbitMqNotificationBus";
import {AzureNotificationBus, IAzureNotificationBusOptions} from "./serviceBus/azure/AzureNotificationBus";
import {INotificationBus, EventPredicate, INotificationBusOptions} from "./serviceBus/notificationBusTypes";

import {withTimeout} from "./utils";

export interface IDistributionNotificationBusOptions
	extends INotificationBusOptions, IRabbitMqNotificationBusOptions, IAzureNotificationBusOptions {

	defaultWaitOnceTimeout?: number;
}

export class HeartbeatBus {
	readonly _options: IDistributionNotificationBusOptions;
	readonly bus: INotificationBus;

	constructor(options: IDistributionNotificationBusOptions) {
		options = {...options};
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
}
