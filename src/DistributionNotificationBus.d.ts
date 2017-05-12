import { IRabbitMqNotificationBusOptions } from "./serviceBus/rabbitMq/RabbitMqNotificationBus";
import { IAzureNotificationBusOptions } from "./serviceBus/azure/AzureNotificationBus";
import { INotificationBus, EventPredicate, INotificationBusOptions } from "./serviceBus/notificationBusTypes";
export interface IDistributionNotificationBusOptions extends INotificationBusOptions, IRabbitMqNotificationBusOptions, IAzureNotificationBusOptions {
    defaultWaitOnceTimeout?: number;
}
export declare class DistributionNotificationBus {
    readonly _options: IDistributionNotificationBusOptions;
    readonly bus: INotificationBus;
    readonly defaultWaitOnceTimeout: number;
    constructor(options: IDistributionNotificationBusOptions);
    startReceiving(): Promise<any>;
    on(eventName: string, listener: (msg: any) => void): void;
    stopReceiving(): Promise<any>;
    waitOnce(resolvePredicate: EventPredicate, rejectPredicate?: EventPredicate, waitTimeout?: number): Promise<Promise<any> | Promise<{}>>;
    waitDistributionPublish(entityTranslationId: string, waitTimeout?: number): Promise<Promise<any> | Promise<{}>>;
    waitDistributionPublishByEntityId(entityId: string, culture: string, waitTimeout?: number): Promise<Promise<any> | Promise<{}>>;
}
