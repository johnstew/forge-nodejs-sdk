import {ForgeManagementApi, ForgeNotificationBus, ForgeCommands} from "./../index"; // forge-nodejs-sdk

const config = require("./../config.js");

const api = new ForgeManagementApi(config.managementApi);
const notificationBus = new ForgeNotificationBus(config.serviceBus);

api.autoWaitCommandNotification(notificationBus);

async function addSitePage(pagePath){
	let cmd = new ForgeCommands.AddSitePage({
		path: pagePath
	});
	let waitAdded = notificationBus.waitCommand(cmd.id(), "SitePageAddedNotification");

	await api.post(cmd);
	const msg = await waitAdded;
	return msg.itemId;
}

function changeTemplate(pageId, template){
	var cmd = new ForgeCommands.ChangePageTemplate({ pageId: pageId, template: template });
	return api.post(cmd);
}

notificationBus.startReceiving()
.then(async () => {

	const pageId = await addSitePage("~/test/sdksample/page_" + (new Date().getTime()));
	console.log("New page id: " + pageId);

	await changeTemplate(pageId, { id:"homePage", namespace:"urn:mynamespace"});

	console.log("Template changed");
})
.then(() => notificationBus.stopReceiving())
.catch((error) => {  // just catch everything here
	console.log(error);
	notificationBus.stopReceiving();
});
