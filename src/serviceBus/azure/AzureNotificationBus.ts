import {AzureAmqpSubscription} from "./AzureAmqpServiceBus.js";

import { INotificationBus, EventPredicate, INotificationBusOptions, MessagePriority, MessagePriorities} from "./../notificationBusTypes";
import {IAzureSubscription} from "./azureNotificationBusTypes";

const azureServiceBus = require("./AzureServiceBus.js");

export interface IAzureNotificationBusOptions extends INotificationBusOptions {
	subscriptionName: string;
	subscriptionOptions?: any;
	useAmqp?: boolean;
	receiveInterval?: number;
	receiveTimeout?: number;
}

export class AzureNotificationBus implements INotificationBus {
	readonly options: IAzureNotificationBusOptions;
	private azureSubscriptions = new Array<IAzureSubscription>();

	constructor(options: IAzureNotificationBusOptions) {
		this.options = options;

		const topicName = options.notificationBusName;

		this.options.subscriptionOptions = this.options.subscriptionOptions	|| {
			DefaultMessageTimeToLive : "PT120S",
			AutoDeleteOnIdle : "PT5M"
		};

		this.options.useAmqp = this.options.hasOwnProperty("useAmqp")
			? this.options.useAmqp
			: true;

		for (const p of MessagePriorities.values) {
			var priority = MessagePriority[p];
			const topicPriorityName = `${topicName}-${MessagePriorities.toShortString(p)}`;
			let subscription;

			if (this.options.useAmqp) {
				subscription =
					new AzureAmqpSubscription(
						this.options.url,
						topicPriorityName,
						options.subscriptionName);
			} else {// legacy version
				subscription =
					new azureServiceBus.AzureSubscription(
						this.options.url,
						topicPriorityName,
						options.subscriptionName,
						this.options.receiveInterval,
						this.options.receiveTimeout);

			}
			this.azureSubscriptions.push(subscription);
		}
	}

	async startReceiving(): Promise<any> {
		for (const subscription of this.azureSubscriptions) {
			await subscription.createIfNotExists(this.options.subscriptionOptions);
			await subscription.startReceiving();
		}
	}

	on(eventName: string, listener: Function): void {
		for (const subscription of this.azureSubscriptions) {
			subscription.on(eventName, listener);
		}
	}

	async stopReceiving(): Promise<any> {
		for (const subscription of this.azureSubscriptions) {
			await subscription.stopReceiving();
		}
	}

	async waitOnce(resolvePredicate: EventPredicate, rejectPredicate: EventPredicate): Promise<any> {
		const promises = new Array<Promise<any>>();

		for (const subscription of this.azureSubscriptions) {
			promises.push(subscription.waitOnce(resolvePredicate, rejectPredicate));
		}
		return Promise.race(promises);
	}

}
