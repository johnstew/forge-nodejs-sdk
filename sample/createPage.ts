/* tslint:disable:no-console */

import {ForgeManagementApi, ForgeNotificationBus, ForgeCommands} from "./../index"; // forge-nodejs-sdk

const config = require("./../config.js");

const api = new ForgeManagementApi(config.managementApi);
const notificationBus = new ForgeNotificationBus(config.serviceBus);

api.autoWaitCommandNotification(notificationBus);

async function addSitePage(pagePath: string) {
	const cmd = new ForgeCommands.AddSitePage({
		path: pagePath
	});
	const waitAdded = notificationBus.waitCommand(cmd.id(), "SitePageAddedNotification");

	await api.post(cmd);
	const msg = await waitAdded;
	return msg.itemId;
}

function changeTemplate(pageId: string, template: { id: string, namespace: string }) {
	const cmd = new ForgeCommands.ChangePageTemplate({ pageId, template });
	return api.post(cmd);
}

notificationBus.startReceiving()
.then(async () => {

	const pageId = await addSitePage("~/test/sdksample/page_" + (new Date().getTime()));
	console.log("New page id: " + pageId);

	await changeTemplate(pageId, { id: "homePage", namespace: "urn:mynamespace"});

	console.log("Template changed");
})
.then(() => notificationBus.stopReceiving())
.catch((error) => {  // just catch everything here
	console.log(error);
	notificationBus.stopReceiving();
});
