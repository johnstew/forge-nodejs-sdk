const entitiesToArchive = [
	{
		"_id" : "09cc8b03-9973-4c3c-8be6-effe5a80cc91",
		"EntityId" : "aebcfe20-3095-410d-8d25-45f2c8942ffe",
		"EntityType" : "album"
	},
	{
		"_id" : "8048322a-3f61-46ef-bc90-7b15f9602881",
		"EntityId" : "0590ded5-fd30-4e9f-8291-252ccc8fe0ed",
		"EntityType" : "album"
	},
	{
		"_id" : "b2df5940-2f47-4e02-9079-c3042ff1e53c",
		"EntityId" : "85edaead-8789-4edf-9134-cbbbd631fbce",
		"EntityType" : "album"
	},
	{
		"_id" : "80602c48-8389-4341-ad25-0300e60b4900",
		"EntityId" : "9f271714-138d-406f-85b4-c26bef6bd7f8",
		"EntityType" : "album"
	},
	{
		"_id" : "1d6dd468-5854-4bc3-b4b3-0d503b3dd2af",
		"EntityId" : "7cf0ef2a-6eb8-4ca3-8139-a48e2bc6ed23",
		"EntityType" : "photo"
	},
	{
		"_id" : "c95ba56c-4d03-42f0-9271-f56058041b66",
		"EntityId" : "0590ded5-fd30-4e9f-8291-252ccc8fe0ed",
		"EntityType" : "album"
	},
	{
		"_id" : "a451a184-6d07-4b6e-a07a-606f7d4a45ea",
		"EntityId" : "506d428f-541f-4fe3-ab6f-8045aab9869f",
		"EntityType" : "photo"
	},
	{
		"_id" : "3655738b-b395-446e-8541-83367e0671c4",
		"EntityId" : "47243e9c-0911-4af3-a7b3-9855a04fb921",
		"EntityType" : "album"
	},
	{
		"_id" : "bff361ab-79aa-45a0-96ba-a67f75e6da2f",
		"EntityId" : "85edaead-8789-4edf-9134-cbbbd631fbce",
		"EntityType" : "album"
	},
	{
		"_id" : "0c38deba-1d3f-44d6-83b8-c58596b1e62c",
		"EntityId" : "273f98c9-bbfb-4a70-8f84-0bccf2e45892",
		"EntityType" : "photo"
	},
	{
		"_id" : "18d6b9bd-685c-43b2-b1d1-ca95cf8bf292",
		"EntityId" : "0590ded5-fd30-4e9f-8291-252ccc8fe0ed",
		"EntityType" : "album"
	},
	{
		"_id" : "ecb386d4-2ddf-4efb-a4ba-1da67b385aa1",
		"EntityId" : "e006e11d-eb64-45d2-a78b-d19744ffb15a",
		"EntityType" : "album"
	},
	{
		"_id" : "139ea7d9-76fe-4246-8ae5-60d07be20c1b",
		"EntityId" : "9f271714-138d-406f-85b4-c26bef6bd7f8",
		"EntityType" : "album"
	},
	{
		"_id" : "e6a855de-2869-4b3f-bf3e-5da01fdb9f85",
		"EntityId" : "e006e11d-eb64-45d2-a78b-d19744ffb15a",
		"EntityType" : "album"
	},
	{
		"_id" : "fc2848e9-fd78-4232-b9b1-06cc849f0cc1",
		"EntityId" : "9f271714-138d-406f-85b4-c26bef6bd7f8",
		"EntityType" : "album"
	},
	{
		"_id" : "7811e0ee-f0fa-407a-91c6-0c6c06318011",
		"EntityId" : "e006e11d-eb64-45d2-a78b-d19744ffb15a",
		"EntityType" : "album"
	}
];


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

connect()
.then(() => {

	var archiveCommands = entitiesToArchive.map(e =>
		new ForgeCommands.Archive({
			AggregateId:e.EntityId,
			TranslationId:e._id,
			AggregateType:e.EntityType
		})
	);

	return api.post(archiveCommands);

})
.then(disconnect)
.catch((error) => {  // just catch everything here
	console.log(error);
	disconnect();
});
