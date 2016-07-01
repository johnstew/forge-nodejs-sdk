"use strict";

const debug = require("debug")("ForgeFrontEndApi");
const request = require("request");
const urlJoin = require("url-join");

class ForgeFrontEndApi {
	constructor(options){
		this.URL = options.url;
		this.KEY = options.authKey;
	}

	get (dataPath){
		const options = {
			url: urlJoin(this.URL, "/cms/api/data/getallraw?format=json&url=" + dataPath),
			headers: {
				"Authorization": "CMS key=" + this.KEY,
				"Accept":"application/json"
			}
		};

		debug("Requesting " + options.url);

		var promise = new Promise((resolve, reject) => {
			request(options, (error, response, body) => {
				if (error) return reject(error);
				if (response.statusCode !== 200) return reject(new Error(response.statusCode));

				resolve(JSON.parse(body));
			});
		});
		return promise;
	}

	getStories (){
		return this.get("/wcm/stories");
	}

	getStory (slug){
		return this.get(`/wcm/stories/${slug}`);
	}
}

module.exports = ForgeFrontEndApi;
