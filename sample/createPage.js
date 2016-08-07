"use strict";

const sdk = require("./../index.js"); // forge-nodejs-sdk
const ForgeManagementApi = sdk.ForgeManagementApi;
const ForgeNotificationBus = sdk.ForgeNotificationBus;
const ForgeCommands = sdk.ForgeCommands;

const config = require("./../config.js");

let api = new ForgeManagementApi(config.managementApi);
let notificationBus = new ForgeNotificationBus(config.serviceBus);
api.autoWaitCommandNotification(notificationBus);

function connect(){
	return notificationBus.startReceiving();
}
function disconnect(){
	return notificationBus.stopReceiving();
}

function addSitePage(pagePath){
	let cmd = new ForgeCommands.AddSitePage({
		path: pagePath
	});
	let waitAdded = notificationBus.waitCommand(cmd.id(), "SitePageAddedNotification");

	return api.post(cmd)
	.then(() => waitAdded)
	.then((msg) => {
		return msg.itemId;
	});
}

function changeTemplate(pageId, template){
	var cmd = new ForgeCommands.ChangePageTemplate({ pageId: pageId, template: template });
	return api.post(cmd);
}

connect()
.then(() => {

	return addSitePage("~/sdksample/page_" + (new Date().getTime()))
	.then((pageId) => {
		console.log("New page id: " + pageId);
		return changeTemplate(pageId, { id:"homePage", namespace:"urn:mynamespace"})
		.then(() => console.log("Template changed"));
	});

})
.then(disconnect, disconnect);
