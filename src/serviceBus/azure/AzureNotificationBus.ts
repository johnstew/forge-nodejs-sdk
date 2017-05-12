import * as Debug from "debug";
const debug = Debug("forgesdk.AzureNotificationBus");

import { AzureAmqpSubscription } from "./AzureAmqpServiceBus.js";

import {
	INotificationBus, EventPredicate,
	INotificationBusOptions, MessagePriorities, ConnectionStatus
} from "./../notificationBusTypes";
import { toCamel } from "../../utils";

import { EventEmitter } from "events";

export interface IAzureNotificationBusOptions extends INotificationBusOptions {
	subscriptionName: string;
	subscriptionOptions?: any;
}

export class AzureNotificationBus extends EventEmitter implements INotificationBus {
	readonly options: IAzureNotificationBusOptions;
	readonly _waitOnceListeners = new Set();
	private azureSubscriptions = new Array<AzureAmqpSubscription>();

	private _started = false;

	constructor(options: IAzureNotificationBusOptions) {
		super();
		this.options = options;

		const topicName = options.notificationBusName;

		this.options.subscriptionOptions = this.options.subscriptionOptions || {
			DefaultMessageTimeToLive: "PT120S",
			AutoDeleteOnIdle: "PT5M"
		};

		const secondaryConnections = this.options.secondaryConnectionStrings || [];
		const allConnectionStrings = [this.options.connectionString, ...secondaryConnections];

		for (const p of MessagePriorities.values) {
			const topicPriorityName = `${topicName}-${MessagePriorities.toShortString(p)}`;

			for (const connectionString of allConnectionStrings) {
				const subscription = this.createSubscription(topicPriorityName, connectionString);

				this.azureSubscriptions.push(subscription);
			}
		}
	}

	async startReceiving(): Promise<void> {
		this._started = true;

		for (const subscription of this.azureSubscriptions) {
			await subscription.connect();
		}
	}

	async stopReceiving(): Promise<void> {
		this._started = false;

		for (const subscription of this.azureSubscriptions) {
			await subscription.close();
		}
	}

	waitOnce(resolvePredicate: EventPredicate, rejectPredicate: EventPredicate): Promise<any> {
		return new Promise((resolve, reject) => {
			this._waitOnceListeners.add({
				resolvePredicate,
				rejectPredicate,
				resolve,
				reject
			});
		});
	}

	private createSubscription(topicName: string, connectionString: string) {
		const subscription = new AzureAmqpSubscription(
			connectionString,
			topicName,
			this.options.subscriptionName,
			this.options.subscriptionOptions);

		subscription.on("message", (msg: any) => this.onAzureMessage(msg));
		subscription.on("error", (msg: any) => this.emitError(msg));
		subscription.on("connectionError", (msg: any) => this.onConnectionError(subscription, msg));
		subscription.on("connectionSuccess", (msg: any) => this.onConnectionSuccess(subscription));

		return subscription;
	}

	private onConnectionSuccess(subscription: AzureAmqpSubscription) {
		debug("Connection success");

		this.emitConnectionStatusChanged({
			connected: true,
			name: subscription._amqpUrl
		});
	}

	private onConnectionError(subscription: AzureAmqpSubscription, err: Error) {
		debug("Connection error, retry after 10s", err);

		this.emitConnectionStatusChanged({
			connected: false,
			error: err,
			name: subscription._amqpUrl
		});

		if (!this._started) {
			return;
		}

		subscription.retryReconnecting();
	}

	private onAzureMessage(msg: any) {
		try {
			if (!msg
				|| !msg.body
				|| !msg.properties
				|| !msg.properties.subject) {
				return;
			}

			/* Parse body
				try to read the body (and check if is serialized with .NET, int this case remove extra characters)
				http://www.bfcamara.com/post/84113031238/send-a-message-to-an-azure-service-bus-queue-with
				"@\u0006string\b3http://schemas.microsoft.com/2003/10/Serialization/?\u000b{ \"a\": \"1\"}"
				"@\u0006string\b3http://schemas.microsoft.com/2003/10/Serialization/�{\u0001{\"ItemId\":\..."
			*/

			let matches = msg.body.match(/(\\u[\S]{4})({.*})/);

			let rawBody;
			if (!matches || matches.length < 2) {
				/*
				 Sometimes .NET serialization uses "strange" characters
				 "♠strin3http://schemas.microsoft.com/2003/10/Serialization/��{\"ItemId\":\..."
				 */
				matches = msg.body.match(/({.*})/);
				if (matches || matches.length >= 1)	{
					rawBody = matches[0];
				}
			} else {
				rawBody = matches[1];
			}

			if (rawBody) {
				msg.body = JSON.parse(matches[0]);
				// azure use PascalCase, I prefer camelCase
				msg.body = toCamel(msg.body);

				this.emitMessage(msg.properties.subject, msg.body);
			}
		} catch (e) {
			this.emitMessage("error", e);
		}
	}

	private emitMessage(name: string, body: any) {
		debug(name, body);

		this.emit(name, body);

		const listeners = this._waitOnceListeners;
		for (const item of listeners) {
			debug(`Checking listener ...`);
			if (item.resolvePredicate && item.resolvePredicate(name, body)) {
				item.resolve(body);
				listeners.delete(item);
			} else if (item.rejectPredicate && item.rejectPredicate(name, body)) {
				item.reject(body);
				listeners.delete(item);
			}
		}
	}

	private emitError(msg: Error): void {
		debug("error", msg);
		this.emit("error", msg);
	}

	private emitConnectionStatusChanged(msg: ConnectionStatus): void {
		this.emit("_connectionStatusChanged", msg);
	}
}
