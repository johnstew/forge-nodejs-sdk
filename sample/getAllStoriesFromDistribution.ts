// tslint:disable:no-console

import { ForgeDistributionApi } from "../index";
import { DistributionList, DistributionEntity } from "../src/ForgeDistributionApi";
const config = require("./../config.js");

const api = new ForgeDistributionApi(config.distributionApi);

console.log(`Calling distribution API and using version ${api.version}`);

api.getStories("en-us")
	.then((storyList) => {
		for (const story of storyList.items) {
			console.log(`Title: ${story.title} Slug: ${story.slug}`);
		}
	})
	.catch((error: Error) => {
		console.log(error);
	});
