/// <reference types="node" />
import * as amqp from "amqplib";
import { EventEmitter } from "events";
export declare class RabbitMqQueueBinding {
    readonly exchange: string;
    readonly routingKey: string;
    constructor(exchange: string, routingKey: string);
}
export declare class RabbitMqQueue {
    readonly queueName: string;
    readonly queueOptions: amqp.Options.AssertQueue;
    readonly bindings: RabbitMqQueueBinding[];
    constructor(queueName: string, queueOptions: amqp.Options.AssertQueue, bindings: RabbitMqQueueBinding[]);
}
export declare class RabbitMqChannel extends EventEmitter {
    readonly URL: string;
    readonly consumers: RabbitMqQueue[];
    private connection;
    private channel;
    constructor(url: string);
    defineConsumer(consumer: RabbitMqQueue): void;
    connect(): Promise<void>;
    close(): Promise<void>;
    private emitMessage(msg);
    private emitConnectionError(msg);
    private emitConnectionSuccess();
}
