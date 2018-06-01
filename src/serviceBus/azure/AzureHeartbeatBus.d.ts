/// <reference types="node" />
import { IHeartbeatBus } from "./../notificationBusTypes";
import { EventEmitter } from "events";
import { IAzureNotificationBusOptions } from "./AzureNotificationBus.js";
export declare class AzureHeartbeatBus extends EventEmitter implements IHeartbeatBus {
    readonly options: IAzureNotificationBusOptions;
    private azureSubscriptions;
    private _started;
    constructor(options: IAzureNotificationBusOptions);
    private createSubscription(topicName, connectionString);
    private onConnectionSuccess(subscription);
    private onConnectionError(subscription, err);
    private emitConnectionStatusChanged(msg);
}
