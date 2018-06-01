
import * as Debug from "debug";
const debug = Debug("forgesdk.ForgeNotificationBus.RabbitMq");
import {RabbitMqChannel} from "./RabbitMqChannel.js";
import {EventEmitter} from "events";

import {IHeartbeatBus, EventPredicate, IHeartbeatBusOptions,
	MessagePriorities, ConnectionStatus} from "./../notificationBusTypes";
import {toCamel} from "../../utils";


export class RabbitMqHeartbeatBus extends EventEmitter implements IHeartbeatBus {

}