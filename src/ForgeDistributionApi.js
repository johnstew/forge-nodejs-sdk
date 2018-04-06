"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = require("node-fetch");
const urlJoin = require("url-join");
const querystring = require("querystring");
const Debug = require("debug");
const debug = Debug("forgesdk.ForgeDistributionApi");
const utils_1 = require("./utils");
var ReadSource;
(function (ReadSource) {
    ReadSource["Default"] = "Default";
    ReadSource["Primary"] = "Primary";
})(ReadSource = exports.ReadSource || (exports.ReadSource = {}));
class ForgeDistributionApi {
    constructor(options) {
        this.URL = options.url;
        this.version = options.version || "v2";
        this.readSource = options.readSource || ReadSource.Default;
    }
    get(path, queryStringObject) {
        let requestUrl = urlJoin(this.URL, path);
        if (queryStringObject) {
            requestUrl += "?" + querystring.stringify(queryStringObject);
        }
        const options = {
            headers: {
                "Accept": "application/json",
                "X-Read-Source": this.readSource
            }
        };
        debug("Requesting " + requestUrl);
        return node_fetch_1.default(requestUrl, options)
            .then(utils_1.handleJsonResponse);
    }
    getStories(culture, queryStringObject) {
        return this.get(`${this.version}/content/${culture}/stories`, queryStringObject);
    }
    getStory(culture, slug) {
        return this.get(`${this.version}/content/${culture}/stories/${slug}`);
    }
    getPhotos(culture, queryStringObject) {
        return this.get(`${this.version}/content/${culture}/photos`, queryStringObject);
    }
    getPhoto(culture, slug) {
        return this.get(`${this.version}/content/${culture}/photos/${slug}`);
    }
    getTags(culture, queryStringObject) {
        return this.get(`${this.version}/content/${culture}/tags`, queryStringObject);
    }
    getTag(culture, slug) {
        return this.get(`${this.version}/content/${culture}/tags/${slug}`);
    }
    getDocuments(culture, queryStringObject) {
        return this.get(`${this.version}/content/${culture}/documents`, queryStringObject);
    }
    getDocument(culture, slug) {
        return this.get(`${this.version}/content/${culture}/documents/${slug}`);
    }
    getAlbums(culture, queryStringObject) {
        return this.get(`${this.version}/content/${culture}/albums`, queryStringObject);
    }
    getAlbum(culture, slug) {
        return this.get(`${this.version}/content/${culture}/albums/${slug}`);
    }
    getCustomEntities(culture, entityCode, queryStringObject) {
        return this.get(`${this.version}/content/${culture}/${entityCode}`, queryStringObject);
    }
    getCustomEntity(culture, entityCode, slug) {
        return this.get(`${this.version}/content/${culture}/${entityCode}/${slug}`);
    }
    getSelection(culture, slug, queryStringObject) {
        return this.get(`${this.version}/content/${culture}/sel-${slug}`, queryStringObject);
    }
}
exports.ForgeDistributionApi = ForgeDistributionApi;
//# sourceMappingURL=ForgeDistributionApi.js.map