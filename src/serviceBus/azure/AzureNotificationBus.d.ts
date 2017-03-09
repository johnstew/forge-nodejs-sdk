import { INotificationBus, EventPredicate, INotificationBusOptions } from "./../notificationBusTypes";
export interface IAzureNotificationBusOptions extends INotificationBusOptions {
    subscriptionName?: string;
    subscriptionOptions?: any;
    useAmqp?: boolean;
    receiveInterval?: number;
    receiveTimeout?: number;
}
export declare class AzureNotificationBus implements INotificationBus {
    readonly options: IAzureNotificationBusOptions;
    private azureSubscriptions;
    constructor(options: IAzureNotificationBusOptions);
    startReceiving(): Promise<any>;
    on(eventName: string, listener: Function): void;
    stopReceiving(): Promise<any>;
    waitOnce(resolvePredicate: EventPredicate, rejectPredicate: EventPredicate): Promise<any>;
}
