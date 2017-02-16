/// <reference types="node" />
import { EventEmitter } from "events";
import { EventPredicate } from "./../notificationBusTypes";
import { IAzureSubscription } from "./azureNotificationBusTypes";
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
    createIfNotExists(options: any): Promise<void>;
    exists(): Promise<boolean>;
    on(eventName: string, listener: Function): void;
    startReceiving(): Promise<any>;
    stopReceiving(): Promise<any>;
    waitOnce(resolvePredicate: EventPredicate, rejectPredicate: EventPredicate): Promise<any>;
    private _normalizeBody(body);
    private _emit(name, body);
    private _createSubscription(options);
    private _createAmqpUrl(azureBusUrl);
    private _receiveMessage(msg);
    private _deleteMessage(message);
}
