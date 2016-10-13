"use strict";

/*
	This sample wait for new events (photo published) and process it using
	a polling technique based on the getEvents management api.
*/

const sdk = require("./../index.js"); // forge-nodejs-sdk
const ForgeManagementApi = sdk.ForgeManagementApi;

const config = require("./../config.js");

let api = new ForgeManagementApi(config.managementApi);

function getWcmEvents(fromCheckpoint){
	return api.getCommits("wcm", { fromCheckpoint: fromCheckpoint });
}

const PUBLISH_PHOTO_EVENT = "Deltatre.Forge.WCM.Shared.Events.EntityPublished`1[[Deltatre.Forge.WCM.Shared.Photos.Photo, Deltatre.Forge.WCM.Shared]], Deltatre.Forge.WCM.Shared";
function processEvent(commit, e){
	// TODO you can process any event, here I process only photo published events
	if (e["$type"] === PUBLISH_PHOTO_EVENT)
		console.log("Photo published at", e.EventDateTime, "checkpoint", commit.Checkpoint);
}

function delay(interval) {
	return new Promise(function(resolve) {
		setTimeout(resolve, interval);
	});
}

function processNextEvents(lastCheckpoint){
	let currentCheckpoint = lastCheckpoint;
	return getWcmEvents(parseInt(lastCheckpoint) + 1)
	.then((commits) => {
		for (let commit of commits) {
			currentCheckpoint = commit.Checkpoint;
			for (let e of commit.Events){
				processEvent(commit, e);
			}
		}

		return currentCheckpoint;
	});
}

// recursively read all checkpoints
//  if no new events are found wait 5seconds and recheck
function waitForNewEvents(fromCheckpoint){
	fromCheckpoint = fromCheckpoint || 0;

	console.log("Reading from checkpoint >", fromCheckpoint);
	return processNextEvents(fromCheckpoint)
	.then((lastCheckpoint) => {
		if (lastCheckpoint == fromCheckpoint) {
			console.log("No new events found, waiting...");
			return delay(5000)
			.then(() => waitForNewEvents(lastCheckpoint));
		}
		else {
			return waitForNewEvents(lastCheckpoint);
		}
	});
}

waitForNewEvents(0)
.catch(console.log.bind(console));  // just catch everything here
