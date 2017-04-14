const debug = require("debug")("ForgeFrontEndApi");
const request = require("request");
const urlJoin = require("url-join");

export class ForgeFrontEndApi {
	URL: string;
	KEY: string;

	constructor(options: { url: string, authKey: string }){
		this.URL = options.url;
		this.KEY = options.authKey;
	}

	get (path: string, questyStringObject?: any){
		const options = {
			url: urlJoin(this.URL, path),
			qs: questyStringObject
		};

		debug("Requesting " + options.url);

		const promise = new Promise((resolve, reject) => {
			request(options, (error: any, response: any, body: any) => {
				if (error) {
					return reject(error);
				}
				if (response.statusCode !== 200) {
					return reject(new Error(response.statusCode));
				}

				resolve(body);
			});
		});
		return promise;
	}

	getApi (path: string, questyStringObject?: any){
		const options = {
			url: urlJoin(this.URL, path),
			qs: questyStringObject,
			headers: {
				Authorization: "CMS key=" + this.KEY,
				Accept: "application/json"
			}
		};

		debug("Requesting " + options.url);

		const promise = new Promise((resolve, reject) => {
			request(options, (error: any, response: any, body: any) => {
				if (error) return reject(error);
				if (response.statusCode !== 200) return reject(new Error(response.statusCode));

				resolve(JSON.parse(body));
			});
		});
		return promise;
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
