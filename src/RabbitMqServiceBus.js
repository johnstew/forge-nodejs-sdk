"use strict";

const debug = require("debug")("rabbitMqServiceBus");
const amqp = require("amqplib");

// Code based on:
// https://www.rabbitmq.com/tutorials/tutorial-three-javascript.html
// https://github.com/squaremo/amqp.node/blob/master/examples/tutorials/receive_logs.js

class RabbitMqChannel {
	constructor(url) {
		this.URL = url;
	}

	connect(){
		return amqp.connect(this.URL)
		.then((conn) => {
			this.connection = conn;
			return conn.createChannel();
		})
		.then((ch) => {
			this.channel = ch;
		});
	}

	close(){
		this.connection.close();
	}

	subscribeToExchange(exchange, listener){
		return this.channel
		.assertQueue("", {exclusive: true})
		.then((qok) => {
			return this.channel.bindQueue(qok.queue, exchange, "")
			.then(() => {
				return qok.queue;
			});
		})
		.then((queue) => {
			return this.channel.consume(queue, listener, {noAck: true});
		})
		.then(() => {
			debug(` [*] Waiting for ${exchange}...`);
		});
	}
}



module.exports.RabbitMqChannel = RabbitMqChannel;
