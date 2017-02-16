"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const amqp = require("amqplib");
const Debug = require("debug");
const debug = Debug("forgesdk.rabbitMqServiceBus");
class RabbitMqChannel {
    constructor(url) {
        this.URL = url;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            this.connection = yield amqp.connect(this.URL);
            this.channel = yield this.connection.createChannel();
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connection.close();
        });
    }
    subscribeToExchange(exchange, listener) {
        return __awaiter(this, void 0, void 0, function* () {
            const qok = yield this.channel
                .assertQueue("", { exclusive: true });
            yield this.channel.bindQueue(qok.queue, exchange, "");
            yield this.channel.consume(qok.queue, listener, { noAck: true });
            debug(` [*] Waiting for ${exchange}...`);
        });
    }
}
exports.RabbitMqChannel = RabbitMqChannel;
