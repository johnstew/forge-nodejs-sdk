import * as Debug from "debug";
const debug = Debug("forgesdk.RabbitMqChannel.RabbitMq");

import * as amqp from "amqplib";
import {EventEmitter} from "events";

// Code based on:
// https://www.rabbitmq.com/tutorials/tutorial-three-javascript.html
// https://github.com/squaremo/amqp.node/blob/master/examples/tutorials/receive_logs.js

export class RabbitMqQueueBinding {
	constructor(
		readonly exchange: string,
		readonly routingKey: string) {
	}
}

export class RabbitMqQueue {
	constructor(
		readonly queueName: string,
		readonly queueOptions: amqp.Options.AssertQueue,
		readonly bindings: RabbitMqQueueBinding[]) {
	}
}

export class RabbitMqChannel extends EventEmitter {
	readonly URL: string;
	private consumers = new Array<RabbitMqQueue>();

	private connection: amqp.Connection | undefined;
	private channel: amqp.Channel | undefined;

	private _connectingTimer: NodeJS.Timer | undefined;

	constructor(url: string) {
		super();

		this.URL = url;
	}

	defineConsumer(consumer: RabbitMqQueue) {
		this.consumers.push(consumer);
	}

	async connect(): Promise<void> {
		debug("Connecting...");

		try {
			this.close().catch(() => {});

			this.connection = await amqp.connect(this.URL);
			this.connection.on("error", (e) => this.emitConnectionError(e));
			this.channel = await this.connection.createChannel();
			this.channel.on("error", (e) => this.emitConnectionError(e));

			for (const q of this.consumers) {
				debug("Asserting queue ", q.queueName, q.queueOptions);
				const qok = await this.channel
					.assertQueue(q.queueName, q.queueOptions);

				for (const b of q.bindings) {
					await this.channel.bindQueue(qok.queue, b.exchange, b.routingKey);
				}

				await this.channel.consume(qok.queue, (m) => this.emitMessage(m), { noAck: true });
			}

			this.emitConnectionSuccess();
		} catch (err) {
			this.emitConnectionError(err);
		}
	}

	async close(): Promise<void> {
		const ch = this.channel;
		const cn = this.connection;

		this.channel = undefined;
		this.connection = undefined;

		this.stopReconnecting();

		if (ch) {
			await ch.close();
		}
		if (cn) {
			await cn.close();
		}
	}

	retryReconnecting() {
		if (this._connectingTimer) {
			return;
		}

		this._connectingTimer = setTimeout(async () => {
			this.stopReconnecting();

			await this.connect();
		}, 10000);
	}

	private stopReconnecting() {
		if (this._connectingTimer) {
			clearTimeout(this._connectingTimer);
			this._connectingTimer = undefined;
		}
	}

	private emitMessage(msg: amqp.Message): void {
		this.emit("message", msg);
	}

	// private emitError(msg: Error): void {
	// 	this.emit("error", msg);
	// }

	private emitConnectionError(msg: Error): void {
		this.emit("connectionError", msg);
	}

	private emitConnectionSuccess(): void {
		this.emit("connectionSuccess");
	}
}
