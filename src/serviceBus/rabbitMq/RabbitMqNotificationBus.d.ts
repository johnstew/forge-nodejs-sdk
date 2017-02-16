/// <reference types="node" />
import { RabbitMqChannel } from "./RabbitMqServiceBus.js";
import { EventEmitter } from "events";
import { INotificationBus, EventPredicate, INotificationBusOptions } from "./../notificationBusTypes";
export interface IRabbitMqNotificationBusOptions extends INotificationBusOptions {
    queueOptions?: any;
}
export declare class RabbitMqNotificationBus implements INotificationBus {
    readonly options: IRabbitMqNotificationBusOptions;
    readonly _eventEmitter: EventEmitter;
    readonly rabbitMqChannel: RabbitMqChannel;
    readonly _waitOnceListeners: Set<any>;
    constructor(options: IRabbitMqNotificationBusOptions);
    startReceiving(): Promise<any>;
    on(eventName: string, listener: Function): void;
    stopReceiving(): Promise<any>;
    waitOnce(resolvePredicate: EventPredicate, rejectPredicate: EventPredicate): Promise<any>;
    private _dispatch(msg);
    private _emit(name, body);
}
