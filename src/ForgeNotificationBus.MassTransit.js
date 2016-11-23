"use strict";

const debug = require("debug")("ForgeNotificationBus.MassTransit");
const rabbitMqServiceBus = require("./RabbitMqServiceBus.js");
const events = require("events");

// OBSOLETE!!! Use RabbitMq version...
class MassTransitForgeNotificationBus {

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
			.subscribeToExchange("Deltatre.ServiceBus:INotification", (msg) => this._dispatch(msg));
		});
	}

	_dispatch(msg){
		let content = JSON.parse(msg.content.toString());
		let body = content.message;
		for (let mt of content.messageType) {
			let notification = mt.substring(mt.lastIndexOf(":")+1);
			debug(notification);
			this._emit(notification, body);
		}
	}

	_emit(name, body){
		this.eventEmitter.emit(name, body);

		let listeners = this.waitOnceListeners;
		for(let item of listeners){
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

module.exports = MassTransitForgeNotificationBus;
