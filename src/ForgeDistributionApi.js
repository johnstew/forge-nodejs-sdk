"use strict";

const debug = require("debug")("ForgeDistributionApi");
const request = require("request");
const urlJoin = require("url-join");

class ForgeDistributionApi {
	constructor(options){
		this.URL = options.url;
	}

	get (path, queryStringObject){
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

	getStories (culture, queryStringObject){
		return this.get(`v1/content/${culture}/stories`, queryStringObject);
	}

	getStory (culture, slug){
		return this.get(`v1/content/${culture}/stories/${slug}`);
	}

	getPhotos (culture, queryStringObject){
		return this.get(`v1/content/${culture}/photos`, queryStringObject);
	}

	getPhoto (culture, slug){
		return this.get(`v1/content/${culture}/photos/${slug}`);
	}

	getTag (culture, slug){
		return this.get(`v1/content/${culture}/tags/${slug}`);
	}

	getDocument (culture, slug){
		return this.get(`v1/content/${culture}/documents/${slug}`);
	}

	getAlbum (culture, slug){
		return this.get(`v1/content/${culture}/albums/${slug}`);
	}

	getCustomEntity (culture, entityCode, slug){
		return this.get(`v1/content/${culture}/${entityCode}/${slug}`);
	}

	getSelection (culture, slug, queryStringObject){
		return this.get(`v1/content/${culture}/sel-${slug}`, queryStringObject);
	}
}

module.exports = ForgeDistributionApi;
