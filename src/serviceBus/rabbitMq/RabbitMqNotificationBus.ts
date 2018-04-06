
import * as Debug from "debug";
const debug = Debug("forgesdk.ForgeNotificationBus.RabbitMq");
import {RabbitMqChannel} from "./RabbitMqChannel.js";
import {EventEmitter} from "events";

import {INotificationBus, EventPredicate, INotificationBusOptions,
	MessagePriorities, ConnectionStatus} from "./../notificationBusTypes";
import {toCamel} from "../../utils";

export interface IRabbitMqNotificationBusOptions extends INotificationBusOptions {
	queueOptions?: any;
	queueName: string;
}

export class RabbitMqNotificationBus extends EventEmitter implements INotificationBus {
	readonly options: IRabbitMqNotificationBusOptions;
	readonly rabbitMqChannels = new Array<RabbitMqChannel>();
	readonly _waitOnceListeners = new Set();

	private _started = false;

	constructor(options: IRabbitMqNotificationBusOptions) {
		super();

		this.options = options;

		const secondaryConnections = this.options.secondaryConnectionStrings || [];
		const allConnectionStrings = [this.options.connectionString, ...secondaryConnections];

		const defaultQueueOptions = {
			exclusive: true,
			durable: false,
			autoDelete: true
		};

		this.options.queueOptions = {...defaultQueueOptions, ...this.options.queueOptions};

		for (const connectionString of allConnectionStrings) {
			this.rabbitMqChannels.push(this.createChannel(connectionString));
		}
	}

	async startReceiving(): Promise<any> {
		debug("Starting...");

		this._started = true;
		for (const channel of this.rabbitMqChannels) {
			await channel.connect();
		}
	}

	async stopReceiving(): Promise<any> {
		debug("Stopping...");

		this._started = false;

		for (const channel of this.rabbitMqChannels) {
			await channel.close();
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

	private createChannel(connectionString: string): RabbitMqChannel {
		const channel = new RabbitMqChannel(connectionString);
		channel.on("message", (msg: any) => this.onRabbitMqMessage(msg));
		channel.on("error", (msg: any) => this.emitError(msg));
		channel.on("connectionError", (msg: any) => this.onConnectionError(channel, msg));
		channel.on("connectionSuccess", (msg: any) => this.onConnectionSuccess(channel));

		for (const p of MessagePriorities.values) {
			const routingKey = MessagePriorities.toShortString(p) + ".*";
			const queueName = this.options.queueName + "-" + MessagePriorities.toShortString(p);

			channel.defineConsumer(
				{
					queueName,
					queueOptions: this.options.queueOptions,
					bindings : [{
						exchange: this.options.notificationBusName,
						routingKey
					}]
				}
			);
		}

		return channel;
	}

	private onConnectionSuccess(channel: RabbitMqChannel) {
		debug("Connection success");

		this.emitConnectionStatusChanged({
			connected: true,
			name: channel.URL
		});
	}

	private onConnectionError(channel: RabbitMqChannel, err: Error) {
		debug("Connection error, retry after 10s", err);

		this.emitConnectionStatusChanged({
			connected: false,
			error: err,
			name: channel.URL
		});

		if (!this._started) {
			return;
		}

		channel.retryReconnecting();
	}

	private onRabbitMqMessage(msg: any) {
		try {
			if (!msg) {
				return;
			}

			if (!msg.properties
				|| !msg.properties.headers
				|| !msg.properties.headers.TypeName) {
				throw new Error("Invalid message");
			}	else {
				const body = JSON.parse(msg.content.toString());
				this.emitMessage(msg.properties.headers.TypeName, toCamel(body));
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
