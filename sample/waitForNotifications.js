"use strict";

/*
	This sample connect to the service bus and
	wait for new publish notifications for story
*/

const sdk = require("./../index.js"); // forge-nodejs-sdk
const ForgeNotificationBus = sdk.ForgeNotificationBus;
const DistributionNotificationBus = sdk.DistributionNotificationBus;

const config = require("./../config.js");

let notificationBus = new ForgeNotificationBus(config.serviceBus);

function connect(){
	return notificationBus.startReceiving();
}
// function disconnect(){
// 	return notificationBus.stopReceiving();
// }

connect()
.then(() => {

	notificationBus.on("error", console.error);

	console.log("Waiting for an entity to be published/unpublished:");
	// notificationBus.on("CommandSuccessNotification", (e) => {
	// 	console.log(`CommandSuccessNotification ${e.commandId}`);
	// });

	notificationBus.on("PublishedBatchNotification", (e) => {
		console.log(`Forge PublishedBatchNotification (Priority:${e.messagePriority})`);
	});

	notificationBus.on("PublishedNotification", (e) => {
		console.log(`Forge PublishedNotification ${e.translationKeys[0].slug} (Priority:${e.messagePriority})`);
	});
	notificationBus.on("UnpublishedNotification", (e) => {
		console.log(`Forge UnpublishedNotification ${e.translationKeys[0].slug} (Priority:${e.messagePriority})`);
	});

})
.catch(console.log.bind(console));  // just catch everything here
