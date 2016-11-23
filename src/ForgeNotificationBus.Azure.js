"use strict";

//const debug = require("debug")("ForgeNotificationBus.Azure");
const azureServiceBus = require("./AzureServiceBus.js");
const uuid = require("node-uuid");

class AzureForgeNotificationBus {

	constructor(options) {
		this.options = options;
		this.options.topicName = this.options.topicName	|| "forgenotifications";
		this.options.subscriptionName = this.options.subscriptionName	|| "forge-sdk-" + uuid.v4();
		this.options.subscriptionOptions = this.options.subscriptionOptions	|| {
			DefaultMessageTimeToLive : "PT10S",
			AutoDeleteOnIdle : "PT5M"
		};

		this.azureSubscription =
		new azureServiceBus.AzureSubscription(
			this.options.url,
			this.options.topicName,
			this.options.subscriptionName);
	}

	startReceiving(){
		return new Promise((resolve, reject) => {
			this.azureSubscription
				.createIfNotExists(this.options.subscriptionOptions, (error) =>{
					if (error) return reject(error);

					this.azureSubscription.startReceiving(this.options.receiveInterval, this.options.receiveTimeout);
					return resolve(true);
				});
		});
	}

	on(notificationName, listener){
		this.azureSubscription.on(notificationName, listener);
	}

	stopReceiving(){
		this.azureSubscription.stopReceiving();
	}

	waitOnce(resolvePredicate, rejectPredicate){
		return this.azureSubscription.waitOnce(resolvePredicate, rejectPredicate);
	}
}

module.exports = AzureForgeNotificationBus;
