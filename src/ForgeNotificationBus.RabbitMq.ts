
import * as Debug from "debug";
const debug = Debug("forgesdk.ForgeNotificationBus.RabbitMq");
import {RabbitMqChannel} from "./RabbitMqServiceBus.js";
import {EventEmitter} from "events";

import {INotificationBus, EventPredicate} from "./notificationBusTypes";
import {IAzureSubscription} from "./azureNotificationBusTypes";

export class RabbitMqForgeNotificationBus implements INotificationBus {
	readonly options: any;
	readonly _eventEmitter: EventEmitter;
	readonly rabbitMqChannel: RabbitMqChannel;
	readonly _waitOnceListeners = new Set();

	constructor(options: any) {
		this.options = options;
		this._eventEmitter = new EventEmitter();
		this.rabbitMqChannel = new RabbitMqChannel(this.options.url);
	}

	startReceiving(): Promise<any>{
		return this.rabbitMqChannel.connect()
		.then(() => {
			return this.rabbitMqChannel
			.subscribeToExchange("forgeNotifications", (msg) => this._dispatch(msg));
		});
	}

	_dispatch(msg){
		try {
			if (!msg.properties
				|| !msg.properties.headers
				|| !msg.properties.headers.TypeName){
				throw new Error("Invalid message");
			}
			else {
				let body = JSON.parse(msg.content.toString());
				this._emit(msg.properties.headers.TypeName, toCamel(body));
			}
		} catch (e) {
			this._emit("error", e);
		}
	}

	_emit(name, body){

		debug(name, body);

		this._eventEmitter.emit(name, body);

		let listeners = this._waitOnceListeners;
		for(let item of listeners){
			if (item.resolvePredicate && item.resolvePredicate(name, body)){
				item.resolve(body);
				listeners.delete(item);
			}
			else if (item.rejectPredicate && item.rejectPredicate(name, body)){
				item.reject(body);
				listeners.delete(item);
			}
		}
	}

	on(eventName: string, listener: Function): void {
		this._eventEmitter.on(eventName, listener);
	}

	stopReceiving(): void {
		this.rabbitMqChannel.close();
	}

	waitOnce(resolvePredicate: EventPredicate, rejectPredicate: EventPredicate): Promise<any>{
		return new Promise((resolve, reject) => {
			this._waitOnceListeners.add({
				resolvePredicate: resolvePredicate,
				rejectPredicate: rejectPredicate,
				resolve: resolve,
				reject: reject
			});
		});
	}
}

function toCamel(o) {
	var build, key, destKey, value;

	if (o instanceof Array) {
		build = [];
		for (key in o) {
			value = o[key];

			if (typeof value === "object") {
				value = toCamel(value);
			}
			build.push(value);
		}
	} else {
		build = {};
		for (key in o) {
			if (o.hasOwnProperty(key)) {
				destKey = (key.charAt(0).toLowerCase() + key.slice(1) || key).toString();
				value = o[key];
				if (value !== null && typeof value === "object") {
					value = toCamel(value);
				}

				build[destKey] = value;
			}
		}
	}
	return build;
}
