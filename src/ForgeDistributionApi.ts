const debug = require("debug")("ForgeDistributionApi");
const request = require("request");
const urlJoin = require("url-join");

export class ForgeDistributionApi {
	URL: string;

	constructor(options: { url: string }){
		this.URL = options.url;
	}

	get (path: string, queryStringObject?: any) {
		const options = {
			url: urlJoin(this.URL, path),
			headers: {
				"Accept":"application/json"
			},
			qs: queryStringObject || null
		};

		debug("Requesting " + options.url);

		var promise = new Promise((resolve, reject) => {
			request(options, (error, response, body) => {
				if (error) return reject(error);
				if (response.statusCode !== 200) {
					return reject(new Error(`${response.statusCode}: ${response.statusMessage}`));
				}

				resolve(JSON.parse(body));
			});
		});
		return promise;
	}

	getStories (culture: string, queryStringObject?: any) {
		return this.get(`v1/content/${culture}/stories`, queryStringObject);
	}

	getStory (culture: string, slug: string) {
		return this.get(`v1/content/${culture}/stories/${slug}`);
	}

	getPhotos (culture: string, queryStringObject?: any){
		return this.get(`v1/content/${culture}/photos`, queryStringObject);
	}

	getPhoto (culture: string, slug: string){
		return this.get(`v1/content/${culture}/photos/${slug}`);
	}

	getTag (culture: string, slug: string){
		return this.get(`v1/content/${culture}/tags/${slug}`);
	}

	getDocument (culture: string, slug: string){
		return this.get(`v1/content/${culture}/documents/${slug}`);
	}

	getAlbum (culture: string, slug: string){
		return this.get(`v1/content/${culture}/albums/${slug}`);
	}

	getCustomEntity (culture: string, entityCode: string, slug: string){
		return this.get(`v1/content/${culture}/${entityCode}/${slug}`);
	}

	getSelection (culture: string, slug: string, queryStringObject?: any){
		return this.get(`v1/content/${culture}/sel-${slug}`, queryStringObject);
	}
}