"use strict";

const sdk = require("./../index.js");
const ForgeManagementApi = sdk.ForgeManagementApi;
const ForgeNotificationBus = sdk.ForgeNotificationBus;
const ForgeCommands = sdk.ForgeCommands;
const uuid = require("node-uuid");

const config = require("./../config.js");

function addSitePage(pagePath){
	let cmd = new ForgeCommands.AddSitePage({
		commandId: uuid.v4(),
		path: pagePath
	});
	let waitAdded = notificationBus.waitCommand(cmd.bodyObject, "SitePageAddedNotification");

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

let api = new ForgeManagementApi(config.managementApi);
let notificationBus = new ForgeNotificationBus(config.serviceBus);
api.autoWaitCommandNotification(notificationBus);

notificationBus.startReceiving()
.then(() => {

	return addSitePage("~/sdksample/page_" + (new Date().getTime()))
	.then((pageId) => {
		console.log("New page id: " + pageId);
		return changeTemplate(pageId, { id:"homePage", namespace:"urn:mynamespace"})
		.then(() => console.log("Template changed"));
	});

})
.then(() => {
	notificationBus.stopReceiving();
});
