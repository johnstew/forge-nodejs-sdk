import * as Debug from "debug";
const debug = Debug("forgesdk.AzureAmqpSubscription");
const debugTracking = Debug("forgesdk.AzureAmqpSubscription.tracking");

import {EventEmitter} from "events";
// see: http://azure.github.io/azure-sdk-for-node/azure-sb/latest/servicebusservice.js.html
import * as azure from "azure";

const amqp10 = require("amqp10");
const AMQPClient = amqp10.Client;
const Policy = amqp10.Policy;

export class AzureAmqpSubscription extends EventEmitter {
	readonly topic: string;
	readonly subscription: string;
	readonly subscriptionOptions: any;

	readonly receiveWithPeekLock = false;
	readonly _amqpUrl: string;
	private _amqpClient: any;

	private serviceBusService: any; // azure.ServiceBusService;
	private _connectingTimer: NodeJS.Timer | undefined;

	constructor(azureBusUrl: string, topic: string, subscription: string, subscriptionOptions?: any) {
		super();
		const retryOperations = new azure.ExponentialRetryPolicyFilter();

		this.topic = topic;
		this.subscription = subscription;
		this.subscriptionOptions = subscriptionOptions || {};

		const serviceBus = azure
			.createServiceBusService(azureBusUrl) as any;
		this.serviceBusService = serviceBus
			.withFilter(retryOperations);

		this._amqpUrl = this._createAmqpUrl(azureBusUrl);
	}

	async connect(): Promise<void> {
		debug(`Connecting to ${this._amqpUrl}...`);

		try {
			this.close().catch(() => {});

			await this.createIfNotExists();

			this._amqpClient = new AMQPClient(Policy.ServiceBusTopic);
			await this._amqpClient.connect(this._amqpUrl);

			const receiver = await this._amqpClient.createReceiver(`${this.topic}/Subscriptions/${this.subscription}`);

			receiver.on("message", (message: any) => {
				this.emitMessage(message);
			});

			// TODO Check... _amqpClient.on("error")...
			receiver.on("error", (e: any) => this.emitConnectionError(e));
			receiver.on("errorReceived", (e: any) => this.emitConnectionError(e));

			this.emitConnectionSuccess();
		} catch (err) {
			this.emitConnectionError(err);
		}
	}

	async close(): Promise<void> {

		const client = this._amqpClient;
		this._amqpClient = undefined;

		this.stopReconnecting();

		if (client) {
			await client.disconnect();
		}
	}

	async retryReconnecting(): Promise<void> {
		if (this._connectingTimer) {
			return;
		}

		this._connectingTimer = setTimeout(async () => {
			this.stopReconnecting();

			await this.connect();
		}, 10000);
	}

	// options: {DefaultMessageTimeToLive : "PT10S",AutoDeleteOnIdle : "PT5M"}
	// note: PT10S=10seconds, PT5M=5minutes
	private async createIfNotExists() {
		debug(`Checking subscription ${this.topic}/${this.subscription} ...`);

		const exists = await this.exists();
		if (exists) {
			debug(`Subscription ${this.topic}/${this.subscription} already exists.`);
			return;
		}

		await this._createSubscription();
	}

	private stopReconnecting() {
		if (this._connectingTimer) {
			clearTimeout(this._connectingTimer);
			this._connectingTimer = undefined;
		}
	}

	private exists(): Promise<boolean> {
		return new Promise((resolve, reject) => {
			this.serviceBusService
			.getSubscription(this.topic, this.subscription, (error: any) => {
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

	private _createSubscription() {
		debug(`Creating subscription ${this.topic}/${this.subscription} ...`, this.subscriptionOptions);

		return new Promise((resolve, reject) => {
			this.serviceBusService
			.createSubscription(this.topic, this.subscription, this.subscriptionOptions, (error: any) => {
				if (error) {
					return reject(error);
				}

				debug(`Subscription ${this.topic}/${this.subscription} created.`);
				resolve();
			});
		});
	}

	private _createAmqpUrl(azureBusUrl: string) {
		const hostNameRegEx = /sb\:\/\/(.*?)\;/;
		const sasNameRegEx = /SharedAccessKeyName=(.*?)(\;|$)/;
		const sasKeyRegEx = /SharedAccessKey=(.*?)(\;|$)/;

		if (!azureBusUrl) {
			throw new Error("Invalid azure bus url");
		}

		try {
			const matchName = azureBusUrl.match(sasNameRegEx);
			if (!matchName) {
				throw new Error("Invalid azure bus url");
			}
			const sasName = matchName[1];

			const matchKey = azureBusUrl.match(sasKeyRegEx);
			if (!matchKey) {
				throw new Error("Invalid azure bus url");
			}
			const sasKey = matchKey[1];

			const matchHost = azureBusUrl.match(hostNameRegEx);
			if (!matchHost) {
				throw new Error("Invalid azure bus url");
			}
			const serviceBusHost = matchHost[1];

			return `amqps://${encodeURIComponent(sasName)}:${encodeURIComponent(sasKey)}@${serviceBusHost}`;
		}	catch (e) {
			throw new Error("Invalid azure bus url");
		}
	}

	private emitMessage(msg: any): void {
		this.emit("message", msg);
	}

	private emitConnectionError(msg: Error): void {
		this.emit("connectionError", msg);
	}

	private emitConnectionSuccess(): void {
		this.emit("connectionSuccess");
	}
}
