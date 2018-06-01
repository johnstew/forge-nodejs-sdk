import * as Debug from "debug";
const debug = Debug("forgesdk.AzureNotificationBus");

import { AzureAmqpSubscription } from "./AzureAmqpServiceBus.js";
import * as serviceBusBodyParser from "./serviceBusBodyParser";

import {
	IHeartbeatBus, EventPredicate,
	IHeartbeatBusOptions, MessagePriorities, ConnectionStatus
} from "./../notificationBusTypes";
import { toCamel } from "../../utils";

import { EventEmitter } from "events";

export class AzureHeartbeatBus extends EventEmitter implements IHeartbeatBus {

}