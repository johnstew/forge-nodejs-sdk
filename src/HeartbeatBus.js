"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shortid = require("shortid");
const RabbitMqNotificationBus_1 = require("./serviceBus/rabbitMq/RabbitMqNotificationBus");
const AzureNotificationBus_1 = require("./serviceBus/azure/AzureNotificationBus");
class HeartbeatBus {
    constructor(options) {
        options = Object.assign({}, options);
        options.notificationBusName = options.notificationBusName || "dist-ntf";
        // for compatibility with older sdk...
        if (!options.connectionString) {
            options.connectionString = options.url;
        }
        if (!options.connectionString) {
            throw new Error("Invalid configuration, connectionString cannot be empty");
        }
        this._options = options;
        if (options.connectionString.startsWith("amqp")) {
            options.queueName = options.queueName || "dist-ntf-sdk-" + shortid.generate();
            this.bus = new RabbitMqNotificationBus_1.RabbitMqNotificationBus(options);
        }
        else {
            options.subscriptionName = options.subscriptionName || "sdk-" + shortid.generate();
            this.bus = new AzureNotificationBus_1.AzureNotificationBus(options);
        }
    }
}
exports.HeartbeatBus = HeartbeatBus;
//# sourceMappingURL=HeartbeatBus.js.map