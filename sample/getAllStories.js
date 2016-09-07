"use strict";

const sdk = require("./../index.js"); // forge-nodejs-sdk
const ForgeManagementApi = sdk.ForgeManagementApi;

const config = require("./../config.js");

let api = new ForgeManagementApi(config.managementApi);

let options = null; //{"WorkflowFields.approvalStatus" : "Rejected"};

api.getStories("working", options)
.then((stories) => {
	for (let story of stories) {
		console.log(story.Title);
	}
})
.catch((error) => {  // just catch everything here
	console.log(error);
});
