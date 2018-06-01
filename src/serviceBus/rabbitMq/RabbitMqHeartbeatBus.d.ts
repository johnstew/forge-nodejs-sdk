/// <reference types="node" />
import { RabbitMqChannel } from "./RabbitMqChannel.js";
import { IHeartbeatBus } from "./../notificationBusTypes";
import { IRabbitMqNotificationBusOptions } from "./RabbitMqNotificationBus.js";
import { EventEmitter } from "events";
export declare class RabbitMqHeartbeatBus extends EventEmitter implements IHeartbeatBus {
    readonly options: IRabbitMqNotificationBusOptions;
    readonly rabbitMqChannels: RabbitMqChannel[];
    private _started;
    constructor(options: IRabbitMqNotificationBusOptions);
    private createChannel(connectionString);
    private onConnectionSuccess(channel);
    private onConnectionError(channel, err);
    private emitError(msg);
    private emitConnectionStatusChanged(msg);
}
