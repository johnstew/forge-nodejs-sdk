import * as amqp from "amqplib";
export declare class RabbitMqChannel {
    readonly URL: string;
    connection: amqp.Connection;
    channel: amqp.Channel;
    constructor(url: string);
    connect(): Promise<any>;
    close(): Promise<any>;
    subscribeToExchange(exchange: string, queueOptions: amqp.Options.AssertQueue, listener: (msg: amqp.Message) => any, queueRoutingKey?: string, queueName?: string): Promise<any>;
}
