export declare type EventPredicate = (name: string, body: any) => boolean;
export interface INotificationBus {
    startReceiving(): Promise<any>;
    stopReceiving(): Promise<any>;
    on(eventName: string, listener: Function): void;
    waitOnce(resolvePredicate: EventPredicate, rejectPredicate?: EventPredicate): Promise<any>;
}
export interface INotificationBusOptions {
    connectionString: string;
    secondaryConnectionStrings?: string[];
    notificationBusName: string;
}
export declare enum MessagePriority {
    Background = 0,
    Foreground = 1,
}
export declare class MessagePriorities {
    static values: MessagePriority[];
    static toShortString(value: MessagePriority): "bg" | "fg";
}
