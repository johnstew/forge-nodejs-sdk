// tslint:disable-next-line:no-implicit-dependencies
import { assert } from "chai";

import { ForgeManagementApi } from "../src/ForgeManagementApi";
import * as ForgeCommands from "../src/ForgeCommands";
import { JsonApiServerStub } from "./JsonApiServerStub";

describe("ForgeManagementApi", function() {
	let server: JsonApiServerStub;
	let api: ForgeManagementApi;
	const authKey = "xyz";
	const sdkVersion = require("../package.json").version;
	const manegementApiUrl = "http://127.0.0.1:8989/";

	before(async function() {
		server = new JsonApiServerStub();
		await server.connect(8989);

		api = new ForgeManagementApi({
			url: manegementApiUrl,
			authKey
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

	it("post command calls server", async function() {
		server.responseStatusCode = 204;
		server.responseHeaders = {};
		server.response = undefined;

		const cmdResult = await api.post(new ForgeCommands.EnsureTag({ slug: "my-slug-1" }));

		assert.isDefined(server.lastCall);
		if (!server.lastCall) {
			throw new Error("No calls performed");
		}
		assert.equal(server.lastCall.method, "POST");
		assert.equal(server.lastCall.headers.authorization, `GUIShellApp key=${authKey}`);
		assert.equal(server.lastCall.headers["user-agent"], "NodeSDK/" + sdkVersion);
		assert.equal(server.lastCall.headers.accept, "application/json");
		assert.equal(server.lastCall.headers["content-type"], "application/json");
	});

	it("post command fail if status code is not 200 and error msg is returned", async function() {
		server.responseStatusCode = 500;
		server.response = { Message: "my-msg" };

		try {
			await api.post(new ForgeCommands.EnsureTag({ slug: "my-slug-1" }));
		} catch (err) {
			assert.equal(err.message, "500 my-msg");
			return;
		}
		throw new Error("Expected to fail");
	});

	it("post command fail if status code is not 200 and error response is not a json", async function() {
		server.responseStatusCode = 500;
		server.response = "bla bla bla";

		try {
			await api.post(new ForgeCommands.EnsureTag({ slug: "my-slug-1" }));
		} catch (err) {
			assert.equal(err.message, "500 Internal Server Error");
			return;
		}
		throw new Error("Expected to fail");
	});

	it("post command fail if status code is not 200 and error response is not a json content", async function() {
		server.responseStatusCode = 500;
		server.responseHeaders = { "Content-Type": "text" };

		try {
			await api.post(new ForgeCommands.EnsureTag({ slug: "my-slug-1" }));
		} catch (err) {
			assert.equal(err.message, "500 Internal Server Error");
			return;
		}
		throw new Error("Expected to fail");
	});

	it("post command fail if name is not resolved", async function() {
		const apiFail = new ForgeManagementApi({
			url: "http://some-not-existing-url",
			authKey
		});

		try {
			await apiFail.post(new ForgeCommands.EnsureTag({ slug: "my-slug-1" }));
		} catch (err) {
			assert.isTrue(err.message.includes("ENOTFOUND"));
			return;
		}
		throw new Error("Expected to fail");
	});

	it("post command calls server and fill command values", async function() {
		const cmdResult = await api.post(new ForgeCommands.EnsureTag({ slug: "my-slug-1" }));

		assert.isDefined(server.lastCall);
		if (!server.lastCall) {
			throw new Error("No calls performed");
		}

		assert.isString(cmdResult.commandId);
	});

	it("post ack command calls server and parse the result", async function() {
		const command = new ForgeCommands.EnsureTag({ slug: "my-slug-1" });

		server.response = { Success: true, Message: "my msg" };

		const cmdResult = await api.postAndWaitAck(command);

		assert.isDefined(server.lastCall);
		if (!server.lastCall) {
			throw new Error("No calls performed");
		}

		assert.deepEqual(cmdResult, command.bodyObject);
	});

	it("post ack command throws when server response has succes equal to false", async function() {
		const command = new ForgeCommands.EnsureTag({ slug: "my-slug-1" });

		server.response = { Success: false, Message: "my error message" };

		try {
			await api.postAndWaitAck(command);
		} catch (e) {

			assert.isDefined(server.lastCall);
			if (!server.lastCall) {
				throw new Error("No calls performed");
			}

			assert.strictEqual(e.message, "my error message");
			return;
		}

		throw new Error("Exception was expected.");
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
		server.responseHeaders = { "Content-Type": "text" };

		try {
			await api.get("/");
		} catch (err) {
			assert.equal(err.message, "500 Internal Server Error");
			return;
		}
		throw new Error("Expected to fail");
	});

	it("get api fail if name is not resolved", async function() {
		const apiFail = new ForgeManagementApi({
			url: "http://some-not-existing-url",
			authKey
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
		await api.get("/test", { q1: "x" });

		assert.isDefined(server.lastCall);
		if (!server.lastCall) {
			throw new Error("No calls performed");
		}
		assert.equal(server.lastCall.path, "/test");
		assert.equal(server.lastCall.queryString.q1, "x");
	});

	it("get api calls server with headers", async function() {
		await api.get("/test", { q1: "x" });

		assert.isDefined(server.lastCall);
		if (!server.lastCall) {
			throw new Error("No calls performed");
		}
		assert.equal(server.lastCall.headers.authorization, `GUIShellApp key=${authKey}`);
		assert.equal(server.lastCall.headers["user-agent"], "NodeSDK/" + sdkVersion);
		assert.equal(server.lastCall.headers.accept, "application/json");
	});

	it("get api parse server response as json", async function() {
		server.response = { myResult: "value1" };

		const result = await api.get("/test", { q1: "x" });

		assert.deepEqual(result, server.response);
	});

	it("get api with custom user agent", async function() {
		api = new ForgeManagementApi({
			url: manegementApiUrl,
			authKey,
			userAgent: "MyApp/1.4"
		});

		await api.get("/test", { q1: "x" });

		assert.isDefined(server.lastCall);
		if (!server.lastCall) {
			throw new Error("No calls performed");
		}
		assert.equal(server.lastCall.path, "/test");
		assert.equal(server.lastCall.queryString.q1, "x");
		assert.equal(server.lastCall.headers.authorization, `GUIShellApp key=${authKey}`);
		assert.equal(server.lastCall.headers["user-agent"], "MyApp/1.4 NodeSDK/" + sdkVersion);
	});
});
