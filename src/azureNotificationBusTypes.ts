
import {INotificationBus} from "./notificationBusTypes";

export interface IAzureSubscription extends INotificationBus {
	createIfNotExists(options: any): Promise<any>;
}
