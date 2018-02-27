/// <reference types="node" />
import { RabbitMqChannel } from "./RabbitMqChannel.js";
import { EventEmitter } from "events";
import { INotificationBus, EventPredicate, INotificationBusOptions } from "./../notificationBusTypes";
export interface IRabbitMqNotificationBusOptions extends INotificationBusOptions {
    queueOptions?: any;
    queueName: string;
}
export declare class RabbitMqNotificationBus extends EventEmitter implements INotificationBus {
    readonly options: IRabbitMqNotificationBusOptions;
    readonly rabbitMqChannels: RabbitMqChannel[];
    readonly _waitOnceListeners: Set<any>;
    private _started;
    constructor(options: IRabbitMqNotificationBusOptions);
    startReceiving(): Promise<any>;
    stopReceiving(): Promise<any>;
    waitOnce(resolvePredicate: EventPredicate, rejectPredicate: EventPredicate): Promise<any>;
    private createChannel(connectionString);
    private onConnectionSuccess(channel);
    private onConnectionError(channel, err);
    private onRabbitMqMessage(msg);
    private emitMessage(name, body);
    private emitError(msg);
    private emitConnectionStatusChanged(msg);
}
