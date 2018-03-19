"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ForgeCommands = require("./ForgeCommands");
const Debug = require("debug");
const debug = Debug("forgesdk.ForgeManagementApi");
const debugTracking = require("debug")("forgesdk.ForgeManagementApi.tracking");
const request = require("request");
const uuid = require("uuid");
const urlJoin = require("url-join");
const packageJson = require("../package.json");
class ForgeManagementApi {
    constructor(options) {
        this.KEY = options.authKey;
        this.FORGE_URL = options.url;
        this.notificationBus = undefined;
        this.defaultHeaders = {
            "Authorization": `GUIShellApp key=${this.KEY}`,
            "User-Agent": "NodeSDK/" + packageJson.version,
            "Accept": "application/json"
        };
        if (options.userAgent) {
            this.defaultHeaders["User-Agent"] = options.userAgent + " " + this.defaultHeaders["User-Agent"];
        }
    }
    post(cmd, waitTimeout) {
        if (Array.isArray(cmd)) {
            return this.post(new ForgeCommands.Batch({ commands: cmd }), waitTimeout);
        }
        if (!cmd.bodyObject) {
            throw new Error("cmd.bodyObject not defined");
        }
        const options = {
            method: "POST",
            url: urlJoin(this.FORGE_URL, "api/command"),
            headers: Object.assign({}, this.defaultHeaders, { "Content-Type": "application/json" }),
            body: cmd,
            json: true
        };
        const waiterPromise = this.notificationBus
            ? this.notificationBus.waitCommand(cmd.bodyObject.commandId, undefined, undefined, waitTimeout)
            : Promise.resolve(true);
        debug("Sending command...", cmd);
        debugTracking(`${cmd.name} ${cmd.bodyObject.commandId} ...`);
        const postPromise = new Promise((resolve, reject) => {
            request(options, (error, response, body) => {
                if (error) {
                    return reject(error);
                }
                if (response.statusCode !== 204) {
                    return reject(new Error(response.statusCode + ":" + body));
                }
                return resolve(cmd.bodyObject);
            });
        });
        return Promise.all([postPromise, waiterPromise])
            .then((values) => values[0]);
    }
    postAndWaitAck(cmd, waitTimeout) {
        if (Array.isArray(cmd)) {
            return this.postAndWaitAck(new ForgeCommands.Batch({ commands: cmd }), waitTimeout);
        }
        if (!cmd.bodyObject) {
            throw new Error("cmd.bodyObject not defined");
        }
        const options = {
            method: "POST",
            url: urlJoin(this.FORGE_URL, "api/command/ack"),
            headers: Object.assign({}, this.defaultHeaders, { "Content-Type": "application/json" }),
            body: cmd,
            json: true
        };
        debug("Sending command and waiting ack...", cmd);
        const promise = new Promise((resolve, reject) => {
            request(options, (error, response, body) => {
                if (error) {
                    return reject(error);
                }
                debug("Response status " + response.statusCode);
                if (response.statusCode !== 200) {
                    return reject(new Error(response.statusCode));
                }
                if (!body.Success) {
                    return reject(new Error(body.Message));
                }
                resolve(cmd.bodyObject);
            });
        });
        return promise;
    }
    autoWaitCommandNotification(notificationBus) {
        this.notificationBus = notificationBus;
    }
    get(path, queryStringObject) {
        const options = {
            url: urlJoin(this.FORGE_URL, path),
            qs: queryStringObject,
            headers: Object.assign({}, this.defaultHeaders)
        };
        debug("Requesting " + options.url);
        const promise = new Promise((resolve, reject) => {
            request(options, (error, response, body) => {
                if (error) {
                    return reject(error);
                }
                debug("Response status " + response.statusCode);
                if (response.statusCode !== 200) {
                    const rejectError = new Error(response.statusCode);
                    rejectError.statusCode = response.statusCode;
                    return reject(rejectError);
                }
                resolve(JSON.parse(body));
            });
        });
        return promise;
    }
    // DEPRECATED use getCommits
    // get all events inside a bucket (vsm, wcm)
    //  you can give all events from a given checkpoint (optional)
    //  and skip or limit returned events
    //  options: {from, skip, limit}
    getEvents(bucketId, options) {
        let safeFromCheckpoint = parseInt(options.from, 10);
        let safeToCheckpoint;
        if (options.skip) {
            safeFromCheckpoint += parseInt(options.skip, 10);
        }
        if (options.limit) {
            safeToCheckpoint = safeFromCheckpoint + parseInt(options.limit, 10);
        }
        const newOptions = { fromCheckpoint: safeFromCheckpoint };
        if (safeToCheckpoint) {
            newOptions.toCheckpoint = safeToCheckpoint;
        }
        return this.getCommits(bucketId, newOptions);
    }
    // get all events inside a bucket (vsm, wcm)
    //  you can give all events from a given checkpoint (optional)
    //  to a given checkpoint (optional)
    //  options: {fromCheckpoint, toCheckpoint}
    getCommits(bucketId, options) {
        return this.get(`api/eventstore/commits/${bucketId}`, options);
    }
    // get all events for a given aggregate inside a bucket (vsm, wcm)
    //  you can filter by minimum or maximum revision (optional)
    //  options: {minRevision, maxRevision}
    getEventsByAggregateId(bucketId, aggregateId, options) {
        return this.get(`api/eventstore/events/${bucketId}/${aggregateId}`, options);
    }
    getStories(version, options) {
        // for compatibility with old version
        if (typeof options === "string") {
            options = { terms: options };
        }
        return this.get(`deltatre.forge.wcm/api/stories/${version}`, options);
    }
    getStory(version, translationId) {
        return this.get(`deltatre.forge.wcm/api/stories/${version}/${translationId}`);
    }
    getStoryByCultureSlug(version, culture, slug) {
        return this.get(`deltatre.forge.wcm/api/stories/${version}/culture/${culture}/slug/${slug}`);
    }
    getPhotos(version, options) {
        // for compatibility with old version
        if (typeof options === "string") {
            options = { terms: options };
        }
        return this.get(`deltatre.forge.wcm/api/photos/${version}`, options);
    }
    getPhoto(version, translationId) {
        return this.get(`deltatre.forge.wcm/api/photos/${version}/${translationId}`);
    }
    getPhotoByCultureSlug(version, culture, slug) {
        return this.get(`deltatre.forge.wcm/api/photos/${version}/culture/${culture}/slug/${slug}`);
    }
    getPhotoTranslations(version, entityId) {
        return this.get(`deltatre.forge.wcm/api/photos/${version}/entity/${entityId}`);
    }
    getTags(version, options) {
        // for compatibility with old version
        if (typeof options === "string") {
            options = { terms: options };
        }
        return this.get(`deltatre.forge.wcm/api/tags/${version}`, options);
    }
    getTag(version, translationId) {
        return this.get(`deltatre.forge.wcm/api/tags/${version}/${translationId}`);
    }
    getTagByCultureSlug(version, culture, slug) {
        return this.get(`deltatre.forge.wcm/api/tags/${version}/culture/${culture}/slug/${slug}`);
    }
    getTagTranslations(version, entityId) {
        return this.get(`deltatre.forge.wcm/api/tags/${version}/entity/${entityId}`);
    }
    getDocuments(version, options) {
        // for compatibility with old version
        if (typeof options === "string") {
            options = { terms: options };
        }
        return this.get(`deltatre.forge.wcm/api/documents/${version}`, options);
    }
    getDocument(version, translationId) {
        return this.get(`deltatre.forge.wcm/api/documents/${version}/${translationId}`);
    }
    getDocumentByCultureSlug(version, culture, slug) {
        return this.get(`deltatre.forge.wcm/api/documents/${version}/culture/${culture}/slug/${slug}`);
    }
    getDocumentTranslations(version, entityId) {
        return this.get(`deltatre.forge.wcm/api/documents/${version}/entity/${entityId}`);
    }
    getSelections(version, options) {
        // for compatibility with old version
        if (typeof options === "string") {
            options = { terms: options };
        }
        return this.get(`deltatre.forge.wcm/api/selections/${version}`, options);
    }
    getSelection(version, translationId) {
        return this.get(`deltatre.forge.wcm/api/selections/${version}/${translationId}`);
    }
    getSelectionByCultureSlug(version, culture, slug) {
        return this.get(`deltatre.forge.wcm/api/selections/${version}/culture/${culture}/slug/${slug}`);
    }
    getSelectionTranslations(version, entityId) {
        return this.get(`deltatre.forge.wcm/api/selections/${version}/entity/${entityId}`);
    }
    getAlbum(version, translationId) {
        return this.get(`deltatre.forge.wcm/api/albums/${version}/${translationId}`);
    }
    getAlbumByCultureSlug(version, culture, slug) {
        return this.get(`deltatre.forge.wcm/api/albums/${version}/culture/${culture}/slug/${slug}`);
    }
    getAlbumTranslations(version, entityId) {
        return this.get(`deltatre.forge.wcm/api/albums/${version}/entity/${entityId}`);
    }
    getAlbums(version, options) {
        // for compatibility with old version
        if (typeof options === "string") {
            options = { terms: options };
        }
        return this.get(`deltatre.forge.wcm/api/albums/${version}`, options);
    }
    getCustomEntity(entityCode, version, translationId) {
        return this.get(`deltatre.forge.wcm/api/customentities/${entityCode}/${version}/${translationId}`);
    }
    getCustomEntityTranslations(entityCode, version, entityId) {
        return this.get(`deltatre.forge.wcm/api/customentities/${entityCode}/${version}/entity/${entityId}`);
    }
    getCustomEntityBySlug(entityCode, version, culture, slug) {
        return this.get(`deltatre.forge.wcm/api/customentities/${entityCode}/${version}/culture/${culture}/slug/${slug}`);
    }
    getCustomEntities(entityCode, version, options) {
        // for compatibility with old version
        if (typeof options === "string") {
            options = { terms: options };
        }
        return this.get(`deltatre.forge.wcm/api/customentities/${entityCode}/${version}`, options);
    }
    getCheckpoints(bucketId) {
        return this.get(`api/checkpoints/list/${bucketId}`);
    }
    getPage(pageId) {
        return this.get(`deltatre.forge.vsm/api/pages/${pageId}`);
    }
    uuid() {
        return uuid.v4();
    }
    randomSlug() {
        return uuid.v4().toLowerCase();
    }
    getAlbumContextualFieldsForElement(entityId, elementId) {
        return this.get(`deltatre.forge.wcm/api/albums/${entityId}/contextualfields/${elementId}`);
    }
    slugify(values) {
        if (!values) {
            throw new Error("Parameter values is mandatory");
        }
        const queryStringObject = {
            values
        };
        const path = "deltatre.forge.wcm/api/entities/slugify";
        return this.get(path, queryStringObject);
    }
}
exports.ForgeManagementApi = ForgeManagementApi;
//# sourceMappingURL=ForgeManagementApi.js.map