import { INotificationBus, EventPredicate } from "./ForgeNotificationBusTypes";
export declare class ForgeNotificationBus {
    readonly _options: any;
    readonly bus: INotificationBus;
    constructor(options: any);
    startReceiving(): Promise<any>;
    on(eventName: string, listener: Function): void;
    stopReceiving(): void;
    waitOnce(resolvePredicate: EventPredicate, rejectPredicate?: EventPredicate, waitTimeout?: number): Promise<any>;
    waitCommand(cmdId: string, successNotificationName: string, failedNotificationName: string, waitTimeout?: number): Promise<any>;
    waitDistributionPublish(entityTranslationId: any, waitTimeout?: number): Promise<any>;
    waitDistributionPublishByEntityId(entityId: any, culture: any, waitTimeout?: number): Promise<any>;
    _withTimeout(p: any, ms: any): Promise<any>;
}
