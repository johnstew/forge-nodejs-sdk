// tslint:disable:no-console

import { ForgeDistributionApi } from "../index";
const config = require("./../config.js");

interface IDistributionList<T> {
	items: T[];
}

interface IStory {
	title: string;
	slug: string;
}

const api = new ForgeDistributionApi(config.distributionApi);

api.getStories("en-us")
	.then((storyList: IDistributionList<IStory>) => {
		for (const story of storyList.items) {
			console.log(`Title: ${story.title} Slug: ${story.slug}`);
		}
	})
	.catch((error) => {
		console.log(error);
	});
