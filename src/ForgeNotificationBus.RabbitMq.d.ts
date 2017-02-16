/// <reference types="node" />
import { RabbitMqChannel } from "./RabbitMqServiceBus.js";
import { EventEmitter } from "events";
import { INotificationBus, EventPredicate } from "./notificationBusTypes";
export declare class RabbitMqForgeNotificationBus implements INotificationBus {
    readonly options: any;
    readonly _eventEmitter: EventEmitter;
    readonly rabbitMqChannel: RabbitMqChannel;
    readonly _waitOnceListeners: Set<any>;
    constructor(options: any);
    startReceiving(): Promise<any>;
    _dispatch(msg: any): void;
    _emit(name: any, body: any): void;
    on(eventName: string, listener: Function): void;
    stopReceiving(): void;
    waitOnce(resolvePredicate: EventPredicate, rejectPredicate: EventPredicate): Promise<any>;
}
