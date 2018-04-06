import fetch, {Response, RequestInit} from "node-fetch";
import * as urlJoin from "url-join";
import * as uuid from "uuid";
import * as querystring from "querystring";

import * as Debug from "debug";
const debug = Debug("forgesdk.ForgeDistributionApi");

import { handleEmptyResponse, handleJsonResponse } from "./utils";


export enum ReadSource {
	Default = "Default",
	Primary = "Primary"
}

export interface IForgeDistributionApiOptions {
	url: string;
	version?: string;
	readSource?: ReadSource;
}

export class ForgeDistributionApi {
	URL: string;
	version: string;
	readSource: ReadSource;

	constructor(options: IForgeDistributionApiOptions) {
		this.URL = options.url;
		this.version = options.version || "v2";
		this.readSource = options.readSource || ReadSource.Default;
	}

	get(path: string, queryStringObject?: any): Promise<any> {
		let requestUrl = urlJoin(this.URL, path);
		if (queryStringObject) {
			requestUrl += "?" + querystring.stringify(queryStringObject);
		}
		const options: RequestInit = {
			headers: {
				"Accept": "application/json",
				"X-Read-Source": this.readSource
			}
		};

		debug("Requesting " + requestUrl);

		return fetch(requestUrl, options)
		.then(handleJsonResponse);
	}

	getStories(culture: string, queryStringObject?: DistributionQueryString): Promise<DistributionList<DistributionEntity>> {
		return this.get(`${this.version}/content/${culture}/stories`, queryStringObject);
	}

	getStory(culture: string, slug: string): Promise<DistributionEntity> {
		return this.get(`${this.version}/content/${culture}/stories/${slug}`);
	}

	getPhotos(culture: string, queryStringObject?: DistributionQueryString): Promise<DistributionList<DistributionEntity>> {
		return this.get(`${this.version}/content/${culture}/photos`, queryStringObject);
	}

	getPhoto(culture: string, slug: string): Promise<DistributionEntity> {
		return this.get(`${this.version}/content/${culture}/photos/${slug}`);
	}

	getTags(culture: string, queryStringObject?: DistributionQueryString): Promise<DistributionList<DistributionEntity>> {
		return this.get(`${this.version}/content/${culture}/tags`, queryStringObject);
	}

	getTag(culture: string, slug: string): Promise<DistributionEntity> {
		return this.get(`${this.version}/content/${culture}/tags/${slug}`);
	}

	getDocuments(culture: string, queryStringObject?: DistributionQueryString): Promise<DistributionList<DistributionEntity>> {
		return this.get(`${this.version}/content/${culture}/documents`, queryStringObject);
	}

	getDocument(culture: string, slug: string): Promise<DistributionEntity> {
		return this.get(`${this.version}/content/${culture}/documents/${slug}`);
	}

	getAlbums(culture: string, queryStringObject?: DistributionQueryString): Promise<DistributionList<DistributionEntity>> {
		return this.get(`${this.version}/content/${culture}/albums`, queryStringObject);
	}

	getAlbum(culture: string, slug: string): Promise<DistributionEntity> {
		return this.get(`${this.version}/content/${culture}/albums/${slug}`);
	}

	getCustomEntities(culture: string, entityCode: string, queryStringObject?: DistributionQueryString): Promise<DistributionList<DistributionEntity>> {
		return this.get(`${this.version}/content/${culture}/${entityCode}`, queryStringObject);
	}

	getCustomEntity(culture: string, entityCode: string, slug: string): Promise<DistributionEntity> {
		return this.get(`${this.version}/content/${culture}/${entityCode}/${slug}`);
	}

	getSelection(culture: string, slug: string, queryStringObject?: DistributionQueryString): Promise<DistributionList<DistributionEntity>> {
		return this.get(`${this.version}/content/${culture}/sel-${slug}`, queryStringObject);
	}
}

export interface DistributionEntity {
	title: string;
	slug: string;
	[name: string]: any;
}

export interface DistributionQueryString {
	[name: string]: string | undefined;
}

export interface DistributionList<T> {
	items: T[];
}
