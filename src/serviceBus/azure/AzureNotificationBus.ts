import {AzureAmqpSubscription} from "./AzureAmqpServiceBus.js";
import * as uuid from "uuid";

import {INotificationBus, EventPredicate, INotificationBusOptions} from "./../notificationBusTypes";
import {IAzureSubscription} from "./azureNotificationBusTypes";

const azureServiceBus = require("./AzureServiceBus.js");

export interface IAzureNotificationBusOptions extends INotificationBusOptions {
	subscriptionName?: string;
	subscriptionOptions?: any;
	useAmqp?: boolean;
	receiveInterval?: number;
	receiveTimeout?: number;
}

export class AzureNotificationBus implements INotificationBus {
	readonly options: IAzureNotificationBusOptions;
	readonly azureSubscription: IAzureSubscription;

	constructor(options: IAzureNotificationBusOptions) {
		this.options = options;

		const topicName = options.notificationBusName;
		const subscriptionName = options.subscriptionName	|| "forge-sdk-" + uuid.v4();

		this.options.subscriptionOptions = this.options.subscriptionOptions	|| {
			DefaultMessageTimeToLive : "PT120S",
			AutoDeleteOnIdle : "PT5M"
		};

		this.options.useAmqp = this.options.hasOwnProperty("useAmqp")
			? this.options.useAmqp
			: true;

		if (this.options.useAmqp) {
			this.azureSubscription =
				new AzureAmqpSubscription(
					this.options.url,
					topicName,
					subscriptionName);
		}	else { // legacy version
			this.azureSubscription =
			new azureServiceBus.AzureSubscription(
				this.options.url,
				topicName,
				subscriptionName,
				this.options.receiveInterval,
				this.options.receiveTimeout);
		}
	}

	startReceiving(): Promise<any> {
		return this.azureSubscription
		.createIfNotExists(this.options.subscriptionOptions)
		.then(() => {
			return this.azureSubscription
			.startReceiving();
		});
	}

	on(eventName: string, listener: Function): void {
		this.azureSubscription.on(eventName, listener);
	}

	async stopReceiving(): Promise<any> {
		await this.azureSubscription.stopReceiving();
	}

	waitOnce(resolvePredicate: EventPredicate, rejectPredicate: EventPredicate): Promise<any> {
		return this.azureSubscription.waitOnce(resolvePredicate, rejectPredicate);
	}
}
