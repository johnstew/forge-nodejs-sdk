"use strict";

/*
	This sample connect to the service bus and
	wait for new publish notifications for story
*/

const sdk = require("./../index.js"); // forge-nodejs-sdk
const DistributionNotificationBus = sdk.DistributionNotificationBus;

const config = require("./../config.js");

let distNotificationBus = new DistributionNotificationBus(config.serviceBus);
distNotificationBus.on("error", console.error);
distNotificationBus.on("_connectionStatusChanged", (s) => {
	console.log(s.name, s.connected ? "-> CONNECTED" : "-> DISCONNECTED " + s.error);
});

function connect(){
	return distNotificationBus.startReceiving();
}
// function disconnect(){
// 	return notificationBus.stopReceiving();
// }

connect()
.then(() => {

	distNotificationBus.on("error", console.error);

	console.log("Waiting for an entity to be published/unpublished:");
	distNotificationBus.on("EntityDistributionNotification", (e) => {
		if (e.action === "publish")
			console.log(`Distribution ${e.entityType} ${e.slug} published`);

		if (e.action === "unpublish")
			console.log(`Distribution ${e.entityType} ${e.slug} unpublished`);
	});

})
.catch(console.log.bind(console));  // just catch everything here
