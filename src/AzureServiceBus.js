"use strict";

const debug = require("debug")("azureServiceBus");
const events = require("events");
const azure = require("azure");

/*
Class wrapper around Azure Service Bus Topic/Subscription API.
Usage:

let bus = require("./azureServiceBus.js");
let subscription = new bus.AzureSubscription(SERVICEBUS_CONNECTION, TOPICNAME, SUBSCRIPTIONNAME);

subscription.onMessage(YOURMSGLABEL, (msg) => {
	// Your code to handle the message
});
subscription.createIfNotExists({}, (error) =>{
	if (error) return console.log(error);

	subscription.startReceiving();
});
*/
class AzureSubscription {
	constructor(azureBusUrl, topic, subscription) {
		const retryOperations = new azure.ExponentialRetryPolicyFilter();

		this.waitOnceListeners = new Set();

		this.receiving = false;
		this.topic = topic;
		this.subscription = subscription;
		this.eventEmitter = new events.EventEmitter();
		this.serviceBusService = azure
		.createServiceBusService(azureBusUrl)
		.withFilter(retryOperations);
	}

	receiveMessage(callback){
		this.serviceBusService
		.receiveSubscriptionMessage(this.topic, this.subscription, (error, receivedMessage) => {
			if(error) return callback(null, null);

			debug(receivedMessage);

			// Parse body
			//	try to read the body (and check if is serialized with .NET, int this case remove extra characters)
			let matches = receivedMessage.body.match(/({.*})/);
			if (matches || matches.length >= 1) receivedMessage.body = JSON.parse(matches[0]);

			return callback(null, receivedMessage);
		});
	}

	// options: {DefaultMessageTimeToLive : "PT10S",AutoDeleteOnIdle : "PT5M"}
	//	note: PT10S=10seconds, PT5M=5minutes
	createIfNotExists(options, callback){
		options = options || {};

		debug(`Checking subscription ${this.topic}/${this.subscription} ...`);

		this.exists((error, exists) => {
			if (error) return callback(error);

			if (exists){
				debug(`Subscription ${this.topic}/${this.subscription} already exists.`);
				return callback(null);
			}

			this.serviceBusService
			.createSubscription(this.topic, this.subscription, options, (error) => {
				if (error) return callback(error);

				debug(`Subscription ${this.topic}/${this.subscription} created.`);
				return callback(null);
			});
		});
	}

	exists(callback){

		this.serviceBusService
		.getSubscription(this.topic, this.subscription, (error) => {
			if (error) {
				if (error.statusCode === 404) return callback(null, false);

				return callback(error, false);
			}

			callback(null, true);
		});
	}

	onMessage(msgLabel, listener){
		this.eventEmitter.on(msgLabel, listener);
	}

	_normalizeBody(body){
		// azure use PascalCase, I prefer camelCase
		return toCamel(body);
	}

	_emit(name, body){
		body = this._normalizeBody(body);
		this.eventEmitter.emit(name, body);

		let listeners = this.waitOnceListeners;
		for(let item of listeners){
			if (item.predicate(name, body)){
				item.resolve(body);
				listeners.delete(item);
			}
		}
	}

	_receivingLoop(receiveInterval){
		this.receiveMessage((error, msg) => {
			if (error) debug(error);
			if (!this.receiving) return;

			if (!error && msg) {
				this._emit(msg.brokerProperties.Label, msg.body);
			}

			setTimeout(() => this._receivingLoop(receiveInterval), receiveInterval);
		});
	}

	startReceiving(receiveInterval){
		receiveInterval = receiveInterval || 500;

		if (this.receiving) return;

		this.receiving = true;
		debug("Start receiving messages...");

		this._receivingLoop(receiveInterval);
	}

	stopReceiving(){
		this.receiving = false;
		debug("Stop receiving messages.");
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

module.exports.AzureSubscription = AzureSubscription;
