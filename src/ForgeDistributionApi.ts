import * as Debug from "debug";
const debug = Debug("forgesdk.ForgeDistributionApi");

const request = require("request");
const urlJoin = require("url-join");

export enum ReadSource {
	Default = "Default",
	Primary = "Primary"
}

export interface IForgeDistributionApiOptions {
	url: string;
	version?: string;
	readSource?: ReadSource;
}

export class ForgeDistributionApi {
	URL: string;
	version: string;
	readSource: ReadSource;

	constructor(options: IForgeDistributionApiOptions) {
		this.URL = options.url;
		this.version = options.version || "v2";
		this.readSource = options.readSource || ReadSource.Default;
	}

	get(path: string, queryStringObject?: any) {
		const options = {
			url: urlJoin(this.URL, path),
			headers: {
				"Accept": "application/json",
				"X-Read-Source": this.readSource
			},
			qs: queryStringObject || null,
			useQuerystring: true
		};

		debug("Requesting " + options.url);

		const promise = new Promise((resolve, reject) => {
			request(options, (error: any, response: any, body: any) => {
				if (error) {
					return reject(error);
				}
				if (response.statusCode !== 200) {
					return reject(new Error(`${response.statusCode}: ${response.statusMessage}`));
				}

				resolve(JSON.parse(body));
			});
		});
		return promise;
	}

	getStories(culture: string, queryStringObject?: any) {
		return this.get(`${this.version}/content/${culture}/stories`, queryStringObject);
	}

	getStory(culture: string, slug: string) {
		return this.get(`${this.version}/content/${culture}/stories/${slug}`);
	}

	getPhotos(culture: string, queryStringObject?: any) {
		return this.get(`${this.version}/content/${culture}/photos`, queryStringObject);
	}

	getPhoto(culture: string, slug: string) {
		return this.get(`${this.version}/content/${culture}/photos/${slug}`);
	}

	getTags(culture: string, queryStringObject?: any) {
		return this.get(`${this.version}/content/${culture}/tags`, queryStringObject);
	}

	getTag(culture: string, slug: string) {
		return this.get(`${this.version}/content/${culture}/tags/${slug}`);
	}

	getDocuments(culture: string, queryStringObject?: any) {
		return this.get(`${this.version}/content/${culture}/documents`, queryStringObject);
	}

	getDocument(culture: string, slug: string) {
		return this.get(`${this.version}/content/${culture}/documents/${slug}`);
	}

	getAlbums(culture: string, queryStringObject?: any) {
		return this.get(`${this.version}/content/${culture}/albums`, queryStringObject);
	}

	getAlbum(culture: string, slug: string) {
		return this.get(`${this.version}/content/${culture}/albums/${slug}`);
	}

	getCustomEntities(culture: string, entityCode: string, queryStringObject?: any) {
		return this.get(`${this.version}/content/${culture}/${entityCode}`, queryStringObject);
	}

	getCustomEntity(culture: string, entityCode: string, slug: string) {
		return this.get(`${this.version}/content/${culture}/${entityCode}/${slug}`);
	}

	getSelection(culture: string, slug: string, queryStringObject?: any) {
		return this.get(`${this.version}/content/${culture}/sel-${slug}`, queryStringObject);
	}
}
