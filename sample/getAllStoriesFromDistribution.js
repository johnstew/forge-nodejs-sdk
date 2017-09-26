"use strict";
// tslint:disable:no-console
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const config = require("./../config.js");
const api = new index_1.ForgeDistributionApi(config.distributionApi);
api.getStories("en-us")
    .then((stories) => {
    for (const story of stories) {
        console.log(`Title: ${story.title} Slug: ${story.slug}`);
    }
})
    .catch((error) => {
    console.log(error);
});
