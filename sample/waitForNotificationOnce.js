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
function disconnect(){
	return notificationBus.stopReceiving();
}

connect()
.then(() => {

	console.log("Waiting for an entity to be published/unpublished:");
	return notificationBus.waitOnce(
		(name) => name == "EntityDistributionNotification",
		(name) => name == "error"
	)
	.then((msg) => {
		console.log("Message arrived: ", msg);
	});

})
.then(disconnect, (e) => {disconnect(); throw e;})
.catch(console.log.bind(console));  // just catch everything here
