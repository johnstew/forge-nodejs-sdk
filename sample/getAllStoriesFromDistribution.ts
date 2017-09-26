// tslint:disable:no-console

import { ForgeDistributionApi } from "../index";
const config = require("./../config.js");

interface IStory {
	title: string;
	slug: string;
}

const api = new ForgeDistributionApi(config.distributionApi);

api.getStories("en-us")
	.then((stories: IStory[]) => {
		for (const story of stories) {
			console.log(`Title: ${story.title} Slug: ${story.slug}`);
		}
	})
	.catch((error) => {
		console.log(error);
	});
