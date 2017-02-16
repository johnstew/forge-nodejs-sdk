/// <reference types="node" />
import { EventEmitter } from "events";
import { IAzureSubscription, EventPredicate } from "./ForgeNotificationBusTypes";
export declare class AzureAmqpSubscription implements IAzureSubscription {
    readonly _waitOnceListeners: Set<any>;
    receiving: boolean;
    readonly topic: string;
    readonly subscription: string;
    readonly receiveWithPeekLock: boolean;
    readonly _eventEmitter: EventEmitter;
    serviceBusService: any;
    readonly _amqpUrl: string;
    _amqpClient: any;
    constructor(azureBusUrl: string, topic: string, subscription: string);
    _createAmqpUrl(azureBusUrl: any): string;
    _receiveMessage(msg: any): void;
    _deleteMessage(message: any): Promise<boolean>;
    createIfNotExists(options: any): Promise<void>;
    private _createSubscription(options);
    exists(): Promise<boolean>;
    on(eventName: string, listener: Function): void;
    _normalizeBody(body: any): any;
    _emit(name: any, body: any): void;
    startReceiving(): Promise<any>;
    stopReceiving(): void;
    waitOnce(resolvePredicate: EventPredicate, rejectPredicate: EventPredicate): Promise<any>;
}
