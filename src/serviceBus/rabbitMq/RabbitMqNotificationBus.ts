
import * as Debug from "debug";
const debug = Debug("forgesdk.ForgeNotificationBus.RabbitMq");
import {RabbitMqChannel} from "./RabbitMqServiceBus.js";
import {EventEmitter} from "events";

import {INotificationBus, EventPredicate, INotificationBusOptions} from "./../notificationBusTypes";
import {toCamel} from "../../utils";

export interface IRabbitMqNotificationBusOptions extends INotificationBusOptions {
	queueOptions?: any;
}

export class RabbitMqNotificationBus implements INotificationBus {
	readonly options: IRabbitMqNotificationBusOptions;
	readonly _eventEmitter: EventEmitter;
	readonly rabbitMqChannel: RabbitMqChannel;
	readonly _waitOnceListeners = new Set();

	constructor(options: IRabbitMqNotificationBusOptions) {
		this.options = options;
		this._eventEmitter = new EventEmitter();
		this.rabbitMqChannel = new RabbitMqChannel(this.options.url);

		this.options.queueOptions = this.options.queueOptions || {
			exclusive: true,
			durable: false,
			autoDelete: true
		};
	}

	async startReceiving(): Promise<any> {
		await this.rabbitMqChannel.connect();
		await this.rabbitMqChannel
			.subscribeToExchange(
				this.options.notificationBusName, // exchange
				this.options.queueOptions,
				(msg) => this._dispatch(msg));
	}

	on(eventName: string, listener: Function): void {
		this._eventEmitter.on(eventName, listener);
	}

	async stopReceiving(): Promise<any> {
		await this.rabbitMqChannel.close();
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

	private _dispatch(msg) {
		try {
			if (!msg.properties
				|| !msg.properties.headers
				|| !msg.properties.headers.TypeName) {
				throw new Error("Invalid message");
			}	else {
				const body = JSON.parse(msg.content.toString());
				this._emit(msg.properties.headers.TypeName, toCamel(body));
			}
		} catch (e) {
			this._emit("error", e);
		}
	}

	private _emit(name, body) {

		debug(name, body);

		this._eventEmitter.emit(name, body);

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
}
