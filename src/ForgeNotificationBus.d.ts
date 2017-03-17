import { IRabbitMqNotificationBusOptions } from "./serviceBus/rabbitMq/RabbitMqNotificationBus";
import { IAzureNotificationBusOptions } from "./serviceBus/azure/AzureNotificationBus";
import { INotificationBus, EventPredicate, INotificationBusOptions } from "./serviceBus/notificationBusTypes";
export interface IForgeNotificationBusOptions extends INotificationBusOptions, IRabbitMqNotificationBusOptions, IAzureNotificationBusOptions {
    defaultWaitOnceTimeout?: number;
}
export declare class ForgeNotificationBus {
    readonly _options: IForgeNotificationBusOptions;
    readonly bus: INotificationBus;
    readonly defaultWaitOnceTimeout: number;
    constructor(options: IForgeNotificationBusOptions);
    startReceiving(): Promise<any>;
    on(eventName: string, listener: (msg) => void): void;
    stopReceiving(): Promise<any>;
    waitOnce(resolvePredicate: EventPredicate, rejectPredicate?: EventPredicate, waitTimeout?: number): Promise<any>;
    waitCommand(cmdId: string, successNotificationName?: string, failedNotificationName?: string, waitTimeout?: number): Promise<any>;
}
