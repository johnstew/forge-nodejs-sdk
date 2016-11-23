"use strict";

const debug = require("debug")("azureServiceBus");
const events = require("events");
const azure = require("azure"); // doo: http://azure.github.io/azure-sdk-for-node/azure-sb/latest/servicebusservice.js.html

/*
Class wrapper around Azure Service Bus Topic/Subscription API.
Usage:

let bus = require("./azureServiceBus.js");
let subscription = new bus.AzureSubscription(SERVICEBUS_CONNECTION, TOPICNAME, SUBSCRIPTIONNAME);

subscription.on(YOURMSGLABEL, (msg) => {
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

		this._waitOnceListeners = new Set();

		this.receiving = false;
		this.topic = topic;
		this.subscription = subscription;
		this._eventEmitter = new events.EventEmitter();
		this.serviceBusService = azure
		.createServiceBusService(azureBusUrl)
		.withFilter(retryOperations);
	}

	_receiveMessage(receiveTimeout, callback){
		receiveTimeout = receiveTimeout || 60000;
		if (receiveTimeout < 1000) receiveTimeout = 1000;

		this.serviceBusService
		.receiveSubscriptionMessage(this.topic, this.subscription, { timeoutIntervalInS : receiveTimeout / 1000}, (error, receivedMessage) => {
			if (error) return callback(error);

			if (!receivedMessage) return callback(null, null);

			// Parse body
			//	try to read the body (and check if is serialized with .NET, int this case remove extra characters)
			// http://www.bfcamara.com/post/84113031238/send-a-message-to-an-azure-service-bus-queue-with
			//  "@\u0006string\b3http://schemas.microsoft.com/2003/10/Serialization/?\u000b{ \"a\": \"1\"}"
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

	on(msgLabel, listener){
		this._eventEmitter.on(msgLabel, listener);
	}

	_normalizeBody(body){
		// azure use PascalCase, I prefer camelCase
		return toCamel(body);
	}

	_emit(name, body){
		if (name != "error")
			body = this._normalizeBody(body);

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

	_receivingLoop(receiveInterval, receiveTimeout){
		this._receiveMessage(receiveTimeout, (error, msg) => {
			if (!this.receiving) return;

			if (error){
				this._emit("error", error);
			}
			else if (msg && msg.brokerProperties && msg.brokerProperties.Label) {
				this._emit(msg.brokerProperties.Label, msg.body);
			}
			else {
				debug("Invalid message format", msg);
			}

			setTimeout(() => this._receivingLoop(receiveInterval, receiveTimeout), receiveInterval);
		});
	}

	startReceiving(receiveInterval, receiveTimeout){
		receiveInterval = receiveInterval || 10;

		if (this.receiving) return;

		this.receiving = true;
		debug(`Start receiving messages... ${receiveInterval} ${receiveTimeout} `);

		this._receivingLoop(receiveInterval, receiveTimeout);
	}

	stopReceiving(){
		this.receiving = false;
		debug("Stop receiving messages.");
	}

	waitOnce(resolvePredicate, rejectPredicate){
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

module.exports.AzureSubscription = AzureSubscription;
