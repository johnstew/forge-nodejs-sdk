/// <reference types="node" />
import { INotificationBus, EventPredicate, INotificationBusOptions } from "./../notificationBusTypes";
import { EventEmitter } from "events";
export interface IAzureNotificationBusOptions extends INotificationBusOptions {
    subscriptionName: string;
    subscriptionOptions?: any;
}
export declare class AzureNotificationBus extends EventEmitter implements INotificationBus {
    readonly options: IAzureNotificationBusOptions;
    readonly _waitOnceListeners: Set<any>;
    private azureSubscriptions;
    private _started;
    constructor(options: IAzureNotificationBusOptions);
    startReceiving(): Promise<void>;
    stopReceiving(): Promise<void>;
    waitOnce(resolvePredicate: EventPredicate, rejectPredicate: EventPredicate): Promise<any>;
    private createSubscription(topicName, connectionString);
    private onConnectionSuccess(subscription);
    private onConnectionError(subscription, err);
    private onAzureMessage(msg);
    private emitMessage(name, body);
    private emitError(msg);
    private emitConnectionStatusChanged(msg);
}
