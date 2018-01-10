"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug = require("debug")("ForgeFrontEndApi");
const request = require("request");
const urlJoin = require("url-join");
class ForgeFrontEndApi {
    constructor(options) {
        this.URL = options.url;
        this.KEY = options.authKey;
    }
    get(path, questyStringObject) {
        const options = {
            url: urlJoin(this.URL, path),
            qs: questyStringObject
        };
        debug("Requesting " + options.url);
        const promise = new Promise((resolve, reject) => {
            request(options, (error, response, body) => {
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
    getApi(path, questyStringObject) {
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
            request(options, (error, response, body) => {
                if (error) {
                    return reject(error);
                }
                if (response.statusCode !== 200) {
                    return reject(new Error(response.statusCode));
                }
                resolve(JSON.parse(body));
            });
        });
        return promise;
    }
    getData(dataPath) {
        return this.getApi("/cms/api/data/getallraw", {
            format: "json",
            url: dataPath
        });
    }
    getDataStories() {
        return this.getData("/wcm/stories");
    }
    getDataStory(slug) {
        return this.getData(`/wcm/stories/${slug}`);
    }
}
exports.ForgeFrontEndApi = ForgeFrontEndApi;
//# sourceMappingURL=ForgeFrontEndApi.js.map