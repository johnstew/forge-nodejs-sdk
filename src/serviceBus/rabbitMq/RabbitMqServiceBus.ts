import * as amqp from "amqplib";
import {EventEmitter} from "events";

import * as Debug from "debug";
const debug = Debug("forgesdk.rabbitMqServiceBus");

// Code based on:
// https://www.rabbitmq.com/tutorials/tutorial-three-javascript.html
// https://github.com/squaremo/amqp.node/blob/master/examples/tutorials/receive_logs.js

export class QueueBinding {
	constructor(
		readonly exchange: string, 
		readonly routingKey: string) {
	}
}

export class QueueConsumer {
	constructor(
		readonly queueName: string,
		readonly queueOptions: amqp.Options.AssertQueue,
		readonly bindings: QueueBinding[]) {
	}
}

export class RabbitMqChannel extends EventEmitter {
	readonly URL: string;
	readonly consumers = new Array<QueueConsumer>();

	private connection: amqp.Connection;
	private channel: amqp.Channel;

	constructor(url: string) {
		super();

		this.URL = url;
	}

	defineConsumer(consumer: QueueConsumer) {
		this.consumers.push(consumer);
	}

	async connect(): Promise<void> {
		this.connection = await amqp.connect(this.URL);
		this.channel = await this.connection.createChannel();
	}

	async close(): Promise<void> {
		if (!this.connection) {
			return;
		}
		await this.connection.close();
	}

	private async configure(): Promise<void> {

		for (const c of this.consumers) {
			const qok = await this.channel
				.assertQueue(queueName, queueOptions);

			await this.channel.bindQueue(qok.queue, exchange, queueRoutingKey);
			await this.channel.consume(qok.queue, listener, { noAck: true });
		}
	}

	private listener(msg: amqp.Message): void {
		this.emit("message", msg);
	}
}
