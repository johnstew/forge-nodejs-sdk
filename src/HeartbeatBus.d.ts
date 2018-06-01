import { IRabbitMqNotificationBusOptions } from "./serviceBus/rabbitMq/RabbitMqNotificationBus";
import { IAzureNotificationBusOptions } from "./serviceBus/azure/AzureNotificationBus";
import { INotificationBus, INotificationBusOptions } from "./serviceBus/notificationBusTypes";
export interface IDistributionNotificationBusOptions extends INotificationBusOptions, IRabbitMqNotificationBusOptions, IAzureNotificationBusOptions {
    defaultWaitOnceTimeout?: number;
}
export declare class HeartbeatBus {
    readonly _options: IDistributionNotificationBusOptions;
    readonly bus: INotificationBus;
    constructor(options: IDistributionNotificationBusOptions);
}
