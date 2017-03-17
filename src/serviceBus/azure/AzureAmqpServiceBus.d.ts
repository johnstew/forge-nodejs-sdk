/// <reference types="node" />
import { EventEmitter } from "events";
export declare class AzureAmqpSubscription extends EventEmitter {
    readonly topic: string;
    readonly subscription: string;
    readonly subscriptionOptions: any;
    readonly receiveWithPeekLock: boolean;
    readonly _amqpUrl: string;
    private _amqpClient;
    private serviceBusService;
    private _connectingTimer;
    constructor(azureBusUrl: string, topic: string, subscription: string, subscriptionOptions?: any);
    connect(): Promise<void>;
    close(): Promise<void>;
    retryReconnecting(): Promise<void>;
    private createIfNotExists();
    private stopReconnecting();
    private exists();
    private _createSubscription();
    private _createAmqpUrl(azureBusUrl);
    private emitMessage(msg);
    private emitConnectionError(msg);
    private emitConnectionSuccess();
}
