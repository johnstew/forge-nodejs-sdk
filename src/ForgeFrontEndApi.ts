import fetch, {Response, RequestInit} from "node-fetch";
import * as urlJoin from "url-join";
import * as uuid from "uuid";
import * as querystring from "querystring";
import * as Debug from "debug";
const debug = Debug("forgesdk.ForgeFrontEndApi");

import { handleTextResponse, handleJsonResponse } from "./utils";

export interface IForgeFrontEndApiOptions {
	url: string;
	authKey: string;
}

export class ForgeFrontEndApi {
	URL: string;
	KEY: string;

	constructor(options: IForgeFrontEndApiOptions) {
		this.URL = options.url;
		this.KEY = options.authKey;
	}

	get(path: string, queryStringObject?: any) {
		let requestUrl = urlJoin(this.URL, path);
		if (queryStringObject) {
			requestUrl += "?" + querystring.stringify(queryStringObject);
		}
		const options: RequestInit = {};

		debug("Requesting " + requestUrl);

		return fetch(requestUrl, options)
		.then(handleTextResponse);
	}

	getApi(path: string, queryStringObject?: any) {
		let requestUrl = urlJoin(this.URL, path);
		if (queryStringObject) {
			requestUrl += "?" + querystring.stringify(queryStringObject);
		}
		const options: RequestInit = {
			headers: {
				Authorization: "CMS key=" + this.KEY,
				Accept: "application/json"
			}
		};

		debug("Requesting " + requestUrl);

		return fetch(requestUrl, options)
		.then(handleJsonResponse);
	}

	getData(dataPath: string) {
		return this.getApi("/cms/api/data/getallraw",
			{
				format: "json",
				url: dataPath
			});
	}

	getDataStories() {
		return this.getData("/wcm/stories");
	}

	getDataStory(slug: string) {
		return this.getData(`/wcm/stories/${slug}`);
	}
}
