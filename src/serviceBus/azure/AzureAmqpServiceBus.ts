import * as Debug from "debug";
const debug = Debug("forgesdk.azureAmqpServiceBus");
const debugTracking = Debug("forgesdk.azureAmqpServiceBus.tracking");

import {EventEmitter} from "events";
// see: http://azure.github.io/azure-sdk-for-node/azure-sb/latest/servicebusservice.js.html
import * as azure from "azure";

import {EventPredicate} from "./../notificationBusTypes";
import {toCamel} from "../../utils";
import {IAzureSubscription} from "./azureNotificationBusTypes";

const amqp10 = require("amqp10");
const AMQPClient = amqp10.Client;
const Policy = amqp10.Policy;

export class AzureAmqpSubscription implements IAzureSubscription {
	readonly _waitOnceListeners = new Set();
	receiving = false;
	readonly topic: string;
	readonly subscription: string;
	readonly receiveWithPeekLock = false;
	readonly _eventEmitter = new EventEmitter();
	serviceBusService: any; // azure.ServiceClient;
	readonly _amqpUrl: string;
	_amqpClient: any;

	constructor(azureBusUrl: string, topic: string, subscription: string) {
		const retryOperations = new azure.ExponentialRetryPolicyFilter();

		this.topic = topic;
		this.subscription = subscription;

		const serviceBus = azure
			.createServiceBusService(azureBusUrl) as any;
		this.serviceBusService = serviceBus
			.withFilter(retryOperations);

		this._amqpUrl = this._createAmqpUrl(azureBusUrl);
	}

	// options: {DefaultMessageTimeToLive : "PT10S",AutoDeleteOnIdle : "PT5M"}
	// note: PT10S=10seconds, PT5M=5minutes
	async createIfNotExists(options) {
		options = options || {};

		debug(`Checking subscription ${this.topic}/${this.subscription} ...`);

		const exists = await this.exists();
		if (exists) {
			debug(`Subscription ${this.topic}/${this.subscription} already exists.`);
			return;
		}

		await this._createSubscription(options);
	}

	exists(): Promise<boolean> {
		return new Promise((resolve, reject) => {
			this.serviceBusService
			.getSubscription(this.topic, this.subscription, (error) => {
				if (error) {
					if (error.statusCode === 404) {
						return resolve(false);
					}

					return reject(error);
				}

				resolve(true);
			});
		});
	}

	on(eventName: string, listener: Function): void {
		this._eventEmitter.on(eventName, listener);
	}

	startReceiving(): Promise<any> {
		if (this.receiving) {
			return Promise.resolve(true);
		}

		debug("Start receiving messages with amqp protocol...");
		this.receiving = true;

		this._amqpClient = new AMQPClient(Policy.ServiceBusTopic);
		return this._amqpClient.connect(this._amqpUrl)
		.then(() => {
			return this._amqpClient.createReceiver(`${this.topic}/Subscriptions/${this.subscription}`);
		})
		.then((receiver) => {
			receiver.on("message", (message) => {
				this._receiveMessage(message);
			});
			receiver.on("errorReceived", (e) => this._emit("error", e));
		});
	}

	async stopReceiving(): Promise<any> {
		this.receiving = false;
		debug("Stop receiving messages.");

		if (this._amqpClient) {
			await this._amqpClient.disconnect();
		}

		this._amqpClient = null;
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

	private _normalizeBody(body) {
		// azure use PascalCase, I prefer camelCase
		return toCamel(body);
	}

	private _emit(name, body) {
		debug(name, body);
		if (name === "CommandSuccessNotification") {
			debugTracking(`... ${body.commandId} OK`);
		}
		if (name === "CommandFailedNotification") {
			debugTracking(`... ${body.commandId} FAIL`);
		}

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
	private _createSubscription(options) {
		return new Promise((resolve, reject) => {
			this.serviceBusService
			.createSubscription(this.topic, this.subscription, options, (error) => {
				if (error) {
					return reject(error);
				}

				debug(`Subscription ${this.topic}/${this.subscription} created.`);
				resolve();
			});
		});
	}

	private _createAmqpUrl(azureBusUrl) {
		const hostNameRegEx = /sb\:\/\/(.*?)\;/;
		const sasNameRegEx = /SharedAccessKeyName=(.*?)(\;|$)/;
		const sasKeyRegEx = /SharedAccessKey=(.*?)(\;|$)/;

		try {
			const sasName = azureBusUrl.match(sasNameRegEx)[1];
			const sasKey = azureBusUrl.match(sasKeyRegEx)[1];
			const serviceBusHost = azureBusUrl.match(hostNameRegEx)[1];

			return `amqps://${encodeURIComponent(sasName)}:${encodeURIComponent(sasKey)}@${serviceBusHost}`;
		}	catch (e) {
			throw new Error("Invalid azure bus url");
		}
	}

	private _receiveMessage(msg) {
		if (!msg
			|| !msg.body
			|| !msg.properties
			|| !msg.properties.subject) {
			return;
		}

		// Parse body
		// try to read the body (and check if is serialized with .NET, int this case remove extra characters)
		// http://www.bfcamara.com/post/84113031238/send-a-message-to-an-azure-service-bus-queue-with
		//  "@\u0006string\b3http://schemas.microsoft.com/2003/10/Serialization/?\u000b{ \"a\": \"1\"}"
		const matches = msg.body.match(/({.*})/);
		if (matches || matches.length >= 1) {
			msg.body = JSON.parse(matches[0]);
			msg.body = this._normalizeBody(msg.body);

			this._emit(msg.properties.subject, msg.body);
		}
	}

	private _deleteMessage(message): Promise<boolean> {
		return new Promise((resolve, reject) => {
			this.serviceBusService
			.deleteMessage(message, (error) => {
				if (error) {
					return reject(error);
				}

				return resolve(true);
			});
		});
	}
}
