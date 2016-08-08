"use strict";

/*
	This sample wait for new notifications (entity published) and process it using
	the service bus subscription.
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

	console.log("Waiting for an entity to be published/unpublished:");
	notificationBus.on("EntityDistributionNotification", (e) => {
		if (e.action === "publish")
			console.log(`Entity ${e.record.slug} published`);

		if (e.action === "unpublish")
			console.log(`Entity ${e.record.slug} unpublished`);
	});

})
.catch(console.log.bind(console));  // just catch everything here
