"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Debug = require("debug");
const debug = Debug("forgesdk.RabbitMqChannel.RabbitMq");
const amqp = require("amqplib");
const events_1 = require("events");
// Code based on:
// https://www.rabbitmq.com/tutorials/tutorial-three-javascript.html
// https://github.com/squaremo/amqp.node/blob/master/examples/tutorials/receive_logs.js
class RabbitMqQueueBinding {
    constructor(exchange, routingKey) {
        this.exchange = exchange;
        this.routingKey = routingKey;
    }
}
exports.RabbitMqQueueBinding = RabbitMqQueueBinding;
class RabbitMqQueue {
    constructor(queueName, queueOptions, bindings) {
        this.queueName = queueName;
        this.queueOptions = queueOptions;
        this.bindings = bindings;
    }
}
exports.RabbitMqQueue = RabbitMqQueue;
class RabbitMqChannel extends events_1.EventEmitter {
    constructor(url) {
        super();
        this.consumers = new Array();
        this.URL = url;
    }
    defineConsumer(consumer) {
        this.consumers.push(consumer);
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            debug("Connecting...");
            try {
                this.close().catch(() => { });
                this.connection = yield amqp.connect(this.URL);
                this.connection.on("error", (e) => this.emitConnectionError(e));
                this.channel = yield this.connection.createChannel();
                this.channel.on("error", (e) => this.emitConnectionError(e));
                for (const q of this.consumers) {
                    const qok = yield this.channel
                        .assertQueue(q.queueName, q.queueOptions);
                    for (const b of q.bindings) {
                        yield this.channel.bindQueue(qok.queue, b.exchange, b.routingKey);
                    }
                    yield this.channel.consume(qok.queue, (m) => this.emitMessage(m), { noAck: true });
                }
                this.emitConnectionSuccess();
            }
            catch (err) {
                this.emitConnectionError(err);
            }
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            const ch = this.channel;
            const cn = this.connection;
            this.channel = undefined;
            this.connection = undefined;
            this.stopReconnecting();
            if (ch) {
                yield ch.close();
            }
            if (cn) {
                yield cn.close();
            }
        });
    }
    retryReconnecting() {
        if (this._connectingTimer) {
            return;
        }
        this._connectingTimer = setTimeout(() => __awaiter(this, void 0, void 0, function* () {
            this.stopReconnecting();
            yield this.connect();
        }), 10000);
    }
    stopReconnecting() {
        if (this._connectingTimer) {
            clearTimeout(this._connectingTimer);
            this._connectingTimer = undefined;
        }
    }
    emitMessage(msg) {
        this.emit("message", msg);
    }
    // private emitError(msg: Error): void {
    // 	this.emit("error", msg);
    // }
    emitConnectionError(msg) {
        this.emit("connectionError", msg);
    }
    emitConnectionSuccess() {
        this.emit("connectionSuccess");
    }
}
exports.RabbitMqChannel = RabbitMqChannel;
