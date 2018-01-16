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
    private consumers;
    private connection;
    private channel;
    private _connectingTimer;
    constructor(url: string);
    defineConsumer(consumer: RabbitMqQueue): void;
    connect(): Promise<void>;
    close(): Promise<void>;
    retryReconnecting(): void;
    private stopReconnecting();
    private emitMessage(msg);
    private emitConnectionError(msg);
    private emitConnectionSuccess();
}
