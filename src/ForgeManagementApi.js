	"use strict";

	const debug = require("debug")("ForgeManagementApi");
	const request = require("request");
	const uuid = require("node-uuid");
	const ForgeCommands = require("./ForgeCommands.js");
	const CommandBase = ForgeCommands.CommandBase;

	class ForgeManagementApi {
		constructor(options){
			this.KEY = options.authKey;
			this.FORGE_URL = options.url;
			this.notificationBus = null;
		}

		post(cmd) {
			debug("Sending command...", cmd);

			if (!cmd.bodyObject) throw new Error("cmd.bodyObject not defined");

			const options = {
				method: "POST",
				url: this.FORGE_URL + "api/command",
				headers: {
					"Authorization": `GUIShellApp key=${this.KEY}`,
					"Accept": "application/json",
					"Content-Type": "application/json"
				},
				body : cmd,
				json : true
			};

			let waiterPromise;
			if (this.notificationBus) waiterPromise = this.notificationBus.waitCommand(cmd.bodyObject);
			else waiterPromise = Promise.resolve(true);

			var postPromise = new Promise((resolve, reject) => {
				request(options, (error, response, body) => {
					if (error) return reject(error);
					if (response.statusCode !== 204) {
						return reject(new Error(response.statusCode + ":" + body));
					}

					return resolve(cmd.bodyObject);
				});
			});

			return Promise.all([postPromise, waiterPromise])
			.then((values) => values[0]);
		}

		autoWaitCommandNotification(notificationBus){
			this.notificationBus = notificationBus;
		}

		get (path){
			const options = {
				url: this.FORGE_URL + path,
				headers: {
					"Authorization": "GUIShellApp key=" + this.KEY,
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

		getEventsByAggregateId(aggregateId){
			return this.get(`api/eventstore/events/${aggregateId}`);
		}

		getStories (version, terms){
			return this.get(`deltatre.forge.wcm/api/stories/${version}?terms=` + terms);
		}

		getStory (version, translationId){
			return this.get(`deltatre.forge.wcm/api/stories/${version}/${translationId}`);
		}

		getPhotos (version, terms){
			return this.get(`deltatre.forge.wcm/api/photos/${version}?terms=` + terms);
		}

		getPhoto (version, translationId){
			return this.get(`deltatre.forge.wcm/api/photos/${version}/${translationId}`);
		}

		getPhotoTranslations (version, entityId){
			return this.get(`deltatre.forge.wcm/api/photos/${version}/entity/${entityId}`);
		}

		getTags (version, terms){
			return this.get(`deltatre.forge.wcm/api/tags/${version}?terms=` + terms);
		}

		getTag (version, translationId){
			return this.get(`deltatre.forge.wcm/api/tags/${version}/${translationId}`);
		}

		getTagByCultureSlug (version, culture, slug){
			return this.get(`deltatre.forge.wcm/api/tags/${version}/culture/${culture}/slug/${slug}`);
		}

		getTagTranslations (version, entityId){
			return this.get(`deltatre.forge.wcm/api/tags/${version}/entity/${entityId}`);
		}

		getDocuments (version, terms){
			return this.get(`deltatre.forge.wcm/api/documents/${version}?terms=` + terms);
		}

		getDocument (version, translationId){
			return this.get(`deltatre.forge.wcm/api/documents/${version}/${translationId}`);
		}

		getDocumentByCultureSlug (version, culture, slug){
			return this.get(`deltatre.forge.wcm/api/documents/${version}/culture/${culture}/slug/${slug}`);
		}

		getDocumentTranslations (version, entityId){
			return this.get(`deltatre.forge.wcm/api/documents/${version}/entity/${entityId}`);
		}

		getSelections (version, terms){
			return this.get(`deltatre.forge.wcm/api/selections/${version}?terms=` + terms);
		}

		getSelection (version, translationId){
			return this.get(`deltatre.forge.wcm/api/selections/${version}/${translationId}`);
		}

		getSelectionByCultureSlug (version, culture, slug){
			return this.get(`deltatre.forge.wcm/api/selections/${version}/culture/${culture}/slug/${slug}`);
		}

		getSelectionTranslations (version, entityId){
			return this.get(`deltatre.forge.wcm/api/selections/${version}/entity/${entityId}`);
		}


		getAlbum (version, translationId){
			return this.get(`deltatre.forge.wcm/api/albums/${version}/${translationId}`);
		}

		getAlbumTranslations (version, entityId){
			return this.get(`deltatre.forge.wcm/api/albums/${version}/entity/${entityId}`);
		}

		getCustomEntity (entityCode, version, translationId){
			return this.get(`deltatre.forge.wcm/api/customentities/${entityCode}/${version}/${translationId}`);
		}
		getCustomEntityTranslations (entityCode, version, entityId){
			return this.get(`deltatre.forge.wcm/api/customentities/${entityCode}/${version}/entity/${entityId}`);
		}
		getCustomEntityBySlug (entityCode, version, culture, slug){
			return this.get(`deltatre.forge.wcm/api/customentities/${entityCode}/${version}/culture/${culture}/slug/${slug}`);
		}

		getCheckpoints (bucketId){
			return this.get(`api/checkpoints/list/${bucketId}`);
		}

		// TODO Da spostare in ForgeCommands
		// cmd: {storyId, translationId, headline}
		setStoryHeadline (cmd) {
			return this.post(new CommandBase("SetStoryHeadlineCommand", cmd));
		}

		getPage (pageId){
			return this.get(`deltatre.forge.vsm/api/pages/${pageId}`);
		}

		uuid() {
			return uuid.v4();
		}

		randomSlug() {
			return uuid.v4().toLowerCase();
		}
	}

	module.exports = ForgeManagementApi;
