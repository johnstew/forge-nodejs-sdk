// tslint:disable-next-line:no-implicit-dependencies
import { assert } from "chai";

import { ForgeDistributionApi } from "../src/ForgeDistributionApi";
import * as ForgeCommands from "../src/ForgeCommands";
import { JsonApiServerStub } from "./JsonApiServerStub";

describe("ForgeDistributionApi", function() {
	let server: JsonApiServerStub;
	let api: ForgeDistributionApi;
	const distApiUrl = "http://127.0.0.1:8989/";

	before(async function() {
		server = new JsonApiServerStub();
		await server.connect(8989);

		api = new ForgeDistributionApi({
			url: distApiUrl
		});
	});

	after(async function() {
		await server.disconnect();
	});

	beforeEach(function() {
		server.resetCalls();
	});

	afterEach(function() {
		server.resetCalls();
	});

	it("get api calls server", async function() {
		await api.get("/test1/test2");

		assert.isDefined(server.lastCall);
		if (!server.lastCall) {
			throw new Error("No calls performed");
		}
		assert.equal(server.lastCall.path, "/test1/test2");
		assert.equal(server.lastCall.method, "GET");
	});

	it("get api fail if status code is not 200 and error msg is returned", async function() {
		server.responseStatusCode = 500;
		server.response = { Message: "my-msg" };

		try {
			await api.get("/");
		} catch (err) {
			assert.equal(err.message, "500 my-msg");
			return;
		}
		throw new Error("Expected to fail");
	});

	it("get api fail if status code is not 200 and error response is not a json", async function() {
		server.responseStatusCode = 500;
		server.response = "bla bla bla";

		try {
			await api.get("/");
		} catch (err) {
			assert.equal(err.message, "500 Internal Server Error");
			return;
		}
		throw new Error("Expected to fail");
	});

	it("get api fail if status code is not 200 and error response is not a json content", async function() {
		server.responseStatusCode = 500;
		server.responseHeaders = {"Content-Type": "text"};

		try {
			await api.get("/");
		} catch (err) {
			assert.equal(err.message, "500 Internal Server Error");
			return;
		}
		throw new Error("Expected to fail");
	});

	it("get api fail if name is not resolved", async function() {
		const apiFail = new ForgeDistributionApi({
			url: "http://some-not-existing-url"
		});

		try {
			await apiFail.get("/");
		} catch (err) {
			assert.isTrue(err.message.includes("ENOTFOUND"));
			return;
		}
		throw new Error("Expected to fail");
	});

	it("get api calls server with query string", async function() {
		await api.get("/test", { q1: "x"});

		assert.isDefined(server.lastCall);
		if (!server.lastCall) {
			throw new Error("No calls performed");
		}
		assert.equal(server.lastCall.path, "/test");
		assert.equal(server.lastCall.queryString.q1, "x");
	});

	it("get api calls server with headers", async function() {
		await api.get("/test", { q1: "x"});

		assert.isDefined(server.lastCall);
		if (!server.lastCall) {
			throw new Error("No calls performed");
		}
		assert.isUndefined(server.lastCall.headers.authorization);
		// assert.equal(server.lastCall.headers["user-agent"], "NodeSDK/" + sdkVersion);
		assert.equal(server.lastCall.headers.accept, "application/json");
		assert.equal(server.lastCall.headers["x-read-source"], "Default");
	});

	it("get api parse server response as json", async function() {
		server.response = { myResult: "value1" };

		const result = await api.get("/test", { q1: "x"});

		assert.deepEqual(result, server.response);
	});

	it("get stories api use default version", async function() {
		await api.getStories("en-us");

		assert.isDefined(server.lastCall);
		if (!server.lastCall) {
			throw new Error("No calls performed");
		}
		assert.equal(server.lastCall.path, `/v2/content/en-us/stories`);
	});
});
