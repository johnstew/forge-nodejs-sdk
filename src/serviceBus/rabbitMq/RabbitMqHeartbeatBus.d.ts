/// <reference types="node" />
import { EventEmitter } from "events";
import { IHeartbeatBus } from "./../notificationBusTypes";
export declare class RabbitMqHeartbeatBus extends EventEmitter implements IHeartbeatBus {
}
