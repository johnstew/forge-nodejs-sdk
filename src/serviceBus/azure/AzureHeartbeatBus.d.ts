/// <reference types="node" />
import { IHeartbeatBus } from "./../notificationBusTypes";
import { EventEmitter } from "events";
export declare class AzureHeartbeatBus extends EventEmitter implements IHeartbeatBus {
}
