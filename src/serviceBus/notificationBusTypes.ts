
export type EventPredicate = (name: string, body: any) => boolean;

export interface INotificationBus {
	startReceiving(): Promise<any>;
	stopReceiving(): Promise<any>;
	on(eventName: string, listener: (msg: any) => void): void;
	waitOnce(resolvePredicate: EventPredicate, rejectPredicate?: EventPredicate): Promise<any>;
}

export interface INotificationBusOptions {
	connectionString: string;
	secondaryConnectionStrings?: string[];
	notificationBusName: string;
}

export enum MessagePriority {
	Background = 0,
	Foreground = 1
}

export class MessagePriorities {
	static values = [MessagePriority.Background, MessagePriority.Foreground];

	static toShortString(value: MessagePriority) {
		switch (value) {
			case MessagePriority.Background:
				return "bg";
			case MessagePriority.Foreground:
				return "fg";
			default:
				throw new Error("Invalid value");
		}
	}
}

export interface ConnectionStatus {
	error?: Error;
	name: string;
	connected: boolean;
}
