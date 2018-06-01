"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shortid = require("shortid");
const RabbitMqHeartbeatBus_1 = require("./serviceBus/rabbitMq/RabbitMqHeartbeatBus");
const AzureHeartbeatBus_1 = require("./serviceBus/azure/AzureHeartbeatBus");
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
            options.queueName = options.queueName || "forge-heartbeats-sdk-" + shortid.generate();
            this.bus = new RabbitMqHeartbeatBus_1.RabbitMqHeartbeatBus(options);
        }
        else {
            options.subscriptionName = options.subscriptionName || "forge-heartbeats-sdk-" + shortid.generate();
            this.bus = new AzureHeartbeatBus_1.AzureHeartbeatBus(options);
        }
    }
}
exports.HeartbeatBus = HeartbeatBus;
//# sourceMappingURL=HeartbeatBus.js.map