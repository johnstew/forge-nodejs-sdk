import { INotificationBus, EventPredicate } from "./notificationBusTypes";
import { IAzureSubscription } from "./azureNotificationBusTypes";
export declare class AzureForgeNotificationBus implements INotificationBus {
    readonly options: any;
    readonly azureSubscription: IAzureSubscription;
    constructor(options: any);
    startReceiving(): Promise<any>;
    on(eventName: string, listener: Function): void;
    stopReceiving(): void;
    waitOnce(resolvePredicate: EventPredicate, rejectPredicate: EventPredicate): Promise<any>;
}
