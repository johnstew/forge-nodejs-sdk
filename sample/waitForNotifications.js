"use strict";

/*
	This sample connect to the service bus and
	wait for new publish notifications for story
*/

const sdk = require("./../index.js"); // forge-nodejs-sdk
const ForgeNotificationBus = sdk.ForgeNotificationBus;

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

	// console.log("Waiting for an entity to be published/unpublished:");
	// notificationBus.on("EntityDistributionNotification", (e) => {
	// 	if (e.action === "publish")
	// 		console.log(`${e.entityType} ${e.slug} published`);
	//
	// 	if (e.action === "unpublish")
	// 		console.log(`${e.entityType} ${e.slug} unpublished`);
	// });

	//notificationBus.on("error", console.error);
	// notificationBus.on("CommandSuccessNotification", (e) => {
	// 	console.log(`CommandSuccessNotification ${e.commandId}`);
	// });

	notificationBus.on("HeartbeatNotification", (e) => {
		console.log(`HeartbeatNotification ${e.nodeId}`);
	});

})
.catch(console.log.bind(console));  // just catch everything here
