import {ForgeManagementApi, ForgeNotificationBus, ForgeCommands} from "./../index"; // forge-nodejs-sdk

const config = require("./../config.js");

const api = new ForgeManagementApi(config.managementApi);
const notificationBus = new ForgeNotificationBus(config.serviceBus);
api.autoWaitCommandNotification(notificationBus);

async function run() {
	await notificationBus.startReceiving();
	try {

		const exportId = api.uuid();
		await api.post(new ForgeCommands.ExportNode({ path: "~/photos/", exportId}));

		const packageResponse = await api.get(`deltatre.forge.vsm/api/exports/node/${exportId}`);

		// tslint:disable-next-line:no-console
		console.log(packageResponse);
	}	finally {
		await notificationBus.stopReceiving();
	}
}

run()
.catch((error) => {  // just catch everything here
	// tslint:disable-next-line:no-console
	console.log(error);
});
