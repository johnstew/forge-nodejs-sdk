import {AzureAmqpSubscription} from "./AzureAmqpServiceBus.js";
import * as uuid from "uuid";

import {INotificationBus, EventPredicate} from "./notificationBusTypes";
import {IAzureSubscription} from "./azureNotificationBusTypes";

const azureServiceBus = require("./AzureServiceBus.js");

export class AzureForgeNotificationBus implements INotificationBus {
	readonly options: any;
	readonly azureSubscription: IAzureSubscription;

	constructor(options: any) {
		this.options = options;
		this.options.topicName = this.options.topicName	|| "forgenotifications";
		this.options.subscriptionName = this.options.subscriptionName	|| "forge-sdk-" + uuid.v4();
		this.options.subscriptionOptions = this.options.subscriptionOptions	|| {
			DefaultMessageTimeToLive : "PT120S",
			AutoDeleteOnIdle : "PT5M"
		};

		this.options.useAmqp = this.options.hasOwnProperty("useAmqp")
			? this.options.useAmqp
			: true;

		if (this.options.useAmqp){
			this.azureSubscription =
			new AzureAmqpSubscription(
				this.options.url,
				this.options.topicName,
				this.options.subscriptionName);
		}
		else {
			this.azureSubscription =
			new azureServiceBus.AzureSubscription(
				this.options.url,
				this.options.topicName,
				this.options.subscriptionName,
				this.options.receiveInterval,
				this.options.receiveTimeout);
		}
	}

	startReceiving(): Promise<any>{
		return this.azureSubscription
		.createIfNotExists(this.options.subscriptionOptions)
		.then(() => {
			return this.azureSubscription
			.startReceiving();
		});
	}

	on(eventName: string, listener: Function): void{
		this.azureSubscription.on(eventName, listener);
	}

	stopReceiving(): void{
		this.azureSubscription.stopReceiving();
	}

	waitOnce(resolvePredicate: EventPredicate, rejectPredicate: EventPredicate): Promise<any>{
		return this.azureSubscription.waitOnce(resolvePredicate, rejectPredicate);
	}
}
