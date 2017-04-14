import * as Debug from "debug";
const debug = Debug("forgesdk.ForgeDistributionApi");

const request = require("request");
const urlJoin = require("url-join");

export class ForgeDistributionApi {
	URL: string;

	constructor(options: { url: string }) {
		this.URL = options.url;
	}

	get(path: string, queryStringObject?: any) {
		const options = {
			url: urlJoin(this.URL, path),
			headers: {
				Accept: "application/json"
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
		return this.get(`v1/content/${culture}/stories`, queryStringObject);
	}

	getStory(culture: string, slug: string) {
		return this.get(`v1/content/${culture}/stories/${slug}`);
	}

	getPhotos(culture: string, queryStringObject?: any) {
		return this.get(`v1/content/${culture}/photos`, queryStringObject);
	}

	getPhoto(culture: string, slug: string) {
		return this.get(`v1/content/${culture}/photos/${slug}`);
	}

	getTags(culture: string, queryStringObject?: any) {
		return this.get(`v1/content/${culture}/tags`, queryStringObject);
	}

	getTag(culture: string, slug: string) {
		return this.get(`v1/content/${culture}/tags/${slug}`);
	}

	getDocuments(culture: string, queryStringObject?: any) {
		return this.get(`v1/content/${culture}/documents`, queryStringObject);
	}

	getDocument(culture: string, slug: string) {
		return this.get(`v1/content/${culture}/documents/${slug}`);
	}

	getAlbums(culture: string, queryStringObject?: any) {
		return this.get(`v1/content/${culture}/albums`, queryStringObject);
	}

	getAlbum(culture: string, slug: string) {
		return this.get(`v1/content/${culture}/albums/${slug}`);
	}

	getCustomEntities(culture: string, entityCode: string, queryStringObject?: any) {
		return this.get(`v1/content/${culture}/${entityCode}`, queryStringObject);
	}

	getCustomEntity(culture: string, entityCode: string, slug: string) {
		return this.get(`v1/content/${culture}/${entityCode}/${slug}`);
	}

	getSelection(culture: string, slug: string, queryStringObject?: any) {
		return this.get(`v1/content/${culture}/sel-${slug}`, queryStringObject);
	}
}
