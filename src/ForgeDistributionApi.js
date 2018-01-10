"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Debug = require("debug");
const debug = Debug("forgesdk.ForgeDistributionApi");
const request = require("request");
const urlJoin = require("url-join");
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
            request(options, (error, response, body) => {
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