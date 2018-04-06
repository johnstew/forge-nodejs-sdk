import fetch, {Response, RequestInit} from "node-fetch";
import * as urlJoin from "url-join";
import * as uuid from "uuid";
import * as querystring from "querystring";

import { handleEmptyResponse, handleJsonResponse } from "./utils";
import { ForgeNotificationBus } from "./ForgeNotificationBus";
import * as ForgeCommands from "./ForgeCommands";
import * as Debug from "debug";
const debug = Debug("forgesdk.ForgeManagementApi");

const packageJson = require("../package.json");

export interface IForgeManagementApiOptions {
	authKey: string;
	url: string;
	userAgent?: string;
}

export class ForgeManagementApi {
	KEY: string;
	FORGE_URL: string;
	notificationBus: ForgeNotificationBus | undefined;
	defaultHeaders: { [name: string]: string };

	constructor(options: IForgeManagementApiOptions) {
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

	// returns the command filled with any default values
	post(cmd: ForgeCommands.CommandBase | ForgeCommands.CommandBase[], waitTimeout?: number): Promise<any> {
		if (Array.isArray(cmd)) {
			return this.post(new ForgeCommands.Batch({ commands: cmd }), waitTimeout);
		}

		if (!cmd.bodyObject) {
			throw new Error("cmd.bodyObject not defined");
		}

		const waiterPromise = this.notificationBus
			? this.notificationBus.waitCommand(cmd.bodyObject.commandId, undefined, undefined, waitTimeout)
			: Promise.resolve(true);

		debug("Sending command...", cmd);

		const requestUrl = urlJoin(this.FORGE_URL, "api/command");
		const options = this.createCmdPostOptions(cmd);

		const postPromise = fetch(requestUrl, options)
		.then(handleEmptyResponse)
		.then(() => cmd.bodyObject);

		return Promise.all([postPromise, waiterPromise])
			.then((values) => values[0]);
	}

	postAndWaitAck(cmd: ForgeCommands.CommandBase | ForgeCommands.CommandBase[], waitTimeout?: number): Promise<CommandNotificationAcknowledgement> {
		if (Array.isArray(cmd)) {
			return this.postAndWaitAck(new ForgeCommands.Batch({ commands: cmd }), waitTimeout);
		}

		if (!cmd.bodyObject) {
			throw new Error("cmd.bodyObject not defined");
		}

		debug("Sending command and waiting ack...", cmd);

		const requestUrl = urlJoin(this.FORGE_URL, "api/command/ack");
		const options = this.createCmdPostOptions(cmd);

		return fetch(requestUrl, options)
		.then(handleJsonResponse);
	}

	autoWaitCommandNotification(notificationBus: ForgeNotificationBus) {
		this.notificationBus = notificationBus;
	}

	get(path: string, queryStringObject?: any): Promise<any> {
		let requestUrl = urlJoin(this.FORGE_URL, path);
		if (queryStringObject) {
			requestUrl += "?" + querystring.stringify(queryStringObject);
		}
		const options: RequestInit = {
			headers: {
				...this.defaultHeaders
			}
		};

		debug("Requesting " + requestUrl);

		return fetch(requestUrl, options)
		.then(handleJsonResponse);
	}

	// DEPRECATED use getCommits
	// get all events inside a bucket (vsm, wcm)
	//  you can give all events from a given checkpoint (optional)
	//  and skip or limit returned events
	//  options: {from, skip, limit}
	getEvents(bucketId: string, options: { from?: any, skip?: any, limit?: any }) {
		let safeFromCheckpoint = parseInt(options.from, 10);
		let safeToCheckpoint;

		if (options.skip) {
			safeFromCheckpoint += parseInt(options.skip, 10);
		}

		if (options.limit) {
			safeToCheckpoint = safeFromCheckpoint + parseInt(options.limit, 10);
		}

		const newOptions: any = { fromCheckpoint: safeFromCheckpoint };

		if (safeToCheckpoint) {
			newOptions.toCheckpoint = safeToCheckpoint;
		}

		return this.getCommits(bucketId, newOptions);
	}

	// get all events inside a bucket (vsm, wcm)
	//  you can give all events from a given checkpoint (optional)
	//  to a given checkpoint (optional)
	//  options: {fromCheckpoint, toCheckpoint}
	getCommits(bucketId: string, options: any) {
		return this.get(`api/eventstore/commits/${bucketId}`, options);
	}

	// get all events for a given aggregate inside a bucket (vsm, wcm)
	//  you can filter by minimum or maximum revision (optional)
	//  options: {minRevision, maxRevision}
	getEventsByAggregateId(bucketId: string, aggregateId: string, options: any) {
		return this.get(`api/eventstore/events/${bucketId}/${aggregateId}`, options);
	}

	getStories(version: string, options: any) {
		// for compatibility with old version
		if (typeof options === "string") {
			options = { terms: options };
		}

		return this.get(`deltatre.forge.wcm/api/stories/${version}`, options);
	}
	getStory(version: string, translationId: string) {
		return this.get(`deltatre.forge.wcm/api/stories/${version}/${translationId}`);
	}
	getStoryByCultureSlug(version: string, culture: string, slug: string) {
		return this.get(`deltatre.forge.wcm/api/stories/${version}/culture/${culture}/slug/${slug}`);
	}

	getPhotos(version: string, options: any) {
		// for compatibility with old version
		if (typeof options === "string") {
			options = { terms: options };
		}

		return this.get(`deltatre.forge.wcm/api/photos/${version}`, options);
	}
	getPhoto(version: string, translationId: string) {
		return this.get(`deltatre.forge.wcm/api/photos/${version}/${translationId}`);
	}
	getPhotoByCultureSlug(version: string, culture: string, slug: string) {
		return this.get(`deltatre.forge.wcm/api/photos/${version}/culture/${culture}/slug/${slug}`);
	}
	getPhotoTranslations(version: string, entityId: string) {
		return this.get(`deltatre.forge.wcm/api/photos/${version}/entity/${entityId}`);
	}

	getTags(version: string, options: any) {
		// for compatibility with old version
		if (typeof options === "string") {
			options = { terms: options };
		}

		return this.get(`deltatre.forge.wcm/api/tags/${version}`, options);
	}

	getTag(version: string, translationId: string) {
		return this.get(`deltatre.forge.wcm/api/tags/${version}/${translationId}`);
	}

	getTagByCultureSlug(version: string, culture: string, slug: string, mode: AssemblerMode = AssemblerMode.Full) {
		const queryStringObj = {
			mode
		};

		return this.get(`deltatre.forge.wcm/api/tags/${version}/culture/${culture}/slug/${slug}`, queryStringObj);
	}

	getTagTranslations(version: string, entityId: string) {
		return this.get(`deltatre.forge.wcm/api/tags/${version}/entity/${entityId}`);
	}

	getTagsByVersionAndEntityIds(version: string, entityIds: string[]) {
		const queryStringObj = {
			entityIds
		};

		const path: string = `deltatre.forge.wcm/api/tags/${version}/entities`;

		return this.get(path, queryStringObj);
	}

	getDocuments(version: string, options: any) {
		// for compatibility with old version
		if (typeof options === "string") {
			options = { terms: options };
		}

		return this.get(`deltatre.forge.wcm/api/documents/${version}`, options);
	}
	getDocument(version: string, translationId: string) {
		return this.get(`deltatre.forge.wcm/api/documents/${version}/${translationId}`);
	}
	getDocumentByCultureSlug(version: string, culture: string, slug: string) {
		return this.get(`deltatre.forge.wcm/api/documents/${version}/culture/${culture}/slug/${slug}`);
	}
	getDocumentTranslations(version: string, entityId: string) {
		return this.get(`deltatre.forge.wcm/api/documents/${version}/entity/${entityId}`);
	}

	getSelections(version: string, options: any) {
		// for compatibility with old version
		if (typeof options === "string") {
			options = { terms: options };
		}

		return this.get(`deltatre.forge.wcm/api/selections/${version}`, options);
	}
	getSelection(version: string, translationId: string) {
		return this.get(`deltatre.forge.wcm/api/selections/${version}/${translationId}`);
	}
	getSelectionByCultureSlug(version: string, culture: string, slug: string) {
		return this.get(`deltatre.forge.wcm/api/selections/${version}/culture/${culture}/slug/${slug}`);
	}
	getSelectionTranslations(version: string, entityId: string) {
		return this.get(`deltatre.forge.wcm/api/selections/${version}/entity/${entityId}`);
	}


	getAlbum(version: string, translationId: string) {
		return this.get(`deltatre.forge.wcm/api/albums/${version}/${translationId}`);
	}
	getAlbumByCultureSlug(version: string, culture: string, slug: string) {
		return this.get(`deltatre.forge.wcm/api/albums/${version}/culture/${culture}/slug/${slug}`);
	}
	getAlbumTranslations(version: string, entityId: string) {
		return this.get(`deltatre.forge.wcm/api/albums/${version}/entity/${entityId}`);
	}
	getAlbums(version: string, options: any) {
		// for compatibility with old version
		if (typeof options === "string") {
			options = { terms: options };
		}

		return this.get(`deltatre.forge.wcm/api/albums/${version}`, options);
	}

	getCustomEntity(entityCode: string, version: string, translationId: string) {
		return this.get(`deltatre.forge.wcm/api/customentities/${entityCode}/${version}/${translationId}`);
	}
	getCustomEntityTranslations(entityCode: string, version: string, entityId: string) {
		return this.get(`deltatre.forge.wcm/api/customentities/${entityCode}/${version}/entity/${entityId}`);
	}
	getCustomEntityBySlug(entityCode: string, version: string, culture: string, slug: string) {
		return this.get(`deltatre.forge.wcm/api/customentities/${entityCode}/${version}/culture/${culture}/slug/${slug}`);
	}
	getCustomEntities(entityCode: string, version: string, options: any) {
		// for compatibility with old version
		if (typeof options === "string") {
			options = { terms: options };
		}

		return this.get(`deltatre.forge.wcm/api/customentities/${entityCode}/${version}`, options);
	}

	getCheckpoints(bucketId: string) {
		return this.get(`api/checkpoints/list/${bucketId}`);
	}

	getPage(pageId: string) {
		return this.get(`deltatre.forge.vsm/api/pages/${pageId}`);
	}

	uuid() {
		return uuid.v4();
	}

	randomSlug() {
		return uuid.v4().toLowerCase();
	}

	getAlbumContextualFieldsForElement(entityId: string, elementId: string) {
		return this.get(`deltatre.forge.wcm/api/albums/${entityId}/contextualfields/${elementId}`);
	}

	slugify(values: string[]): Promise<ISlugificationResult[]> {
		if (!values) {
			throw new Error("Parameter values is mandatory");
		}

		const queryStringObject: any = {
			values
		};

		const path: string = "deltatre.forge.wcm/api/entities/slugify";

		return this.get(path, queryStringObject);
	}

	private createCmdPostOptions(cmd: ForgeCommands.CommandBase): RequestInit {
		return {
			method: "POST",
			headers: {
				...this.defaultHeaders,
				"Content-Type": "application/json"
			},
			body: JSON.stringify(cmd)
		};
	}
}

export interface ISlugificationResult {
	OriginalValue: string;
	SlugifiedValue: string;
}

export enum AssemblerMode {
	Full = 0,
	Compact = 1
}

export interface CommandNotificationAcknowledgement {
	Success: boolean;
	Message?: string;
}
