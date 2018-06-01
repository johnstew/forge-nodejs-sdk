import { IRabbitMqNotificationBusOptions } from "./serviceBus/rabbitMq/RabbitMqNotificationBus";
import { IAzureNotificationBusOptions } from "./serviceBus/azure/AzureNotificationBus";
import { IHeartbeatBus, IHeartbeatBusOptions } from "./serviceBus/notificationBusTypes";
export interface IForgeHeartbeatBus extends IHeartbeatBusOptions, IRabbitMqNotificationBusOptions, IAzureNotificationBusOptions {
    defaultWaitOnceTimeout?: number;
}
export declare class HeartbeatBus {
    readonly _options: IForgeHeartbeatBus;
    readonly bus: IHeartbeatBus;
    constructor(options: IForgeHeartbeatBus);
}
