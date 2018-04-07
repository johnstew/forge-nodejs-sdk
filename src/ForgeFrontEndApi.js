"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = require("node-fetch");
const urlJoin = require("url-join");
const querystring = require("querystring");
const Debug = require("debug");
const debug = Debug("forgesdk.ForgeFrontEndApi");
const httpUtils_1 = require("./httpUtils");
class ForgeFrontEndApi {
    constructor(options) {
        this.URL = options.url;
        this.httpAgent = httpUtils_1.createAgent(this.URL);
        this.KEY = options.authKey;
    }
    get(path, queryStringObject) {
        let requestUrl = urlJoin(this.URL, path);
        if (queryStringObject) {
            requestUrl += "?" + querystring.stringify(queryStringObject);
        }
        const options = {
            agent: this.httpAgent
        };
        debug("Requesting " + requestUrl);
        return node_fetch_1.default(requestUrl, options)
            .then(httpUtils_1.handleTextResponse);
    }
    getApi(path, queryStringObject) {
        let requestUrl = urlJoin(this.URL, path);
        if (queryStringObject) {
            requestUrl += "?" + querystring.stringify(queryStringObject);
        }
        const options = {
            headers: {
                Authorization: "CMS key=" + this.KEY,
                Accept: "application/json"
            },
            agent: this.httpAgent
        };
        debug("Requesting " + requestUrl);
        return node_fetch_1.default(requestUrl, options)
            .then(httpUtils_1.handleJsonResponse);
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