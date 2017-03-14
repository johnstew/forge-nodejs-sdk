import * as amqp from "amqplib";
import * as Debug from "debug";
const debug = Debug("forgesdk.rabbitMqServiceBus");

// Code based on:
// https://www.rabbitmq.com/tutorials/tutorial-three-javascript.html
// https://github.com/squaremo/amqp.node/blob/master/examples/tutorials/receive_logs.js

export class RabbitMqChannel {
	readonly URL: string;
	connection: amqp.Connection;
	channel: amqp.Channel;

	constructor(url: string) {
		this.URL = url;
	}

	async connect(): Promise<void> {
		this.connection = await amqp.connect(this.URL);
		this.channel = await this.connection.createChannel();
		// TODO We should register to "error" events, connection.on("error", ...)
		//  and channel.on("error", ...)
	}

	async close(): Promise<void> {
		if (!this.connection) {
			return;
		}
		await this.connection.close();
	}

	async consume(
		exchange: string,
		queueOptions: amqp.Options.AssertQueue,
		listener: (msg: amqp.Message) => any,
		queueRoutingKey: string = "",
		queueName: string = ""): Promise<void> {

		const qok = await this.channel
			.assertQueue(queueName, queueOptions);

		await this.channel.bindQueue(qok.queue, exchange, queueRoutingKey);
		await this.channel.consume(qok.queue, listener, { noAck: true });

		debug(` [*] Waiting for ${exchange}...`);
	}
}
