
export type EventPredicate = (name: string, body: any) => boolean;
export interface INotificationBus {
	startReceiving(): Promise<any>;
	stopReceiving(): void;
	on(eventName: string, listener: Function): void;
	waitOnce(resolvePredicate: EventPredicate, rejectPredicate?: EventPredicate): Promise<any>;
}

export interface IAzureSubscription extends INotificationBus {
	createIfNotExists(options: any): Promise<any>;
}
