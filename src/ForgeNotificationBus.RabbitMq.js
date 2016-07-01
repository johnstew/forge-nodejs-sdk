"use strict";

const debug = require("debug")("ForgeNotificationBus.RabbitMq");
const rabbitMqServiceBus = require("./RabbitMqServiceBus.js");
const events = require("events");

class RabbitMqForgeNotificationBus {

	constructor(options) {
		this.options = options;
		this.eventEmitter = new events.EventEmitter();
		this.rabbitMqChannel =
		new rabbitMqServiceBus.RabbitMqChannel(
			this.options.url);
		this.waitOnceListeners = new Set();
	}

	startReceiving(){
		return this.rabbitMqChannel.connect()
		.then(() => {
			return this.rabbitMqChannel
			.subscribeToExchange("forgeNotifications", (msg) => this._dispatch(msg));
		});
	}

	_dispatch(msg){
		if (!msg.properties) return;
		if (!msg.properties.headers) return;
		let typeName = msg.properties.headers.TypeName;
		if (!typeName) return;

		debug(typeName);

		let body = JSON.parse(msg.content.toString());
		this._emit(typeName, toCamel(body));
	}

	_emit(name, body){
		this.eventEmitter.emit(name, body);

		let listeners = this.waitOnceListeners;
		for(let item of listeners){
			debug(item);
			if (item.predicate(name, body)){
				item.resolve(body);
				listeners.delete(item);
			}
		}
	}

	on(notificationName, listener){
		this.eventEmitter.on(notificationName, listener);
	}

	stopReceiving(){
		this.rabbitMqChannel.close();
	}

	waitOnce(predicate){
		return new Promise((resolve, reject) => {
			this.waitOnceListeners.add({predicate: predicate, resolve: resolve, reject: reject});
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

module.exports = RabbitMqForgeNotificationBus;
