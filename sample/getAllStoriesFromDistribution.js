"use strict";
// tslint:disable:no-console
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const config = require("./../config.js");
const api = new index_1.ForgeDistributionApi(config.distributionApi);
console.log(`Calling distribution API and using version ${api.version}`);
api.getStories("en-us")
    .then((storyList) => {
    for (const story of storyList.items) {
        console.log(`Title: ${story.title} Slug: ${story.slug}`);
    }
})
    .catch((error) => {
    console.log(error);
});
//# sourceMappingURL=getAllStoriesFromDistribution.js.map