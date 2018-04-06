// tslint:disable-next-line:no-implicit-dependencies
import { assert } from "chai";

import * as http from "http";
import * as url from "url";
import { ForgeManagementApi } from "../src/ForgeManagementApi";
import * as ForgeCommands from "../src/ForgeCommands";

describe("ForgeManagementApi", function() {
	let server: ManagementApiServerStub;
	let api: ForgeManagementApi;
	const authKey = "xyz";
	const sdkVersion = require("../package.json").version;
	const manegementApiUrl = "http://127.0.0.1:8989/";

	before(async function() {
		server = new ManagementApiServerStub();
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
		server.responseHeaders = {"Content-Type": "text"};

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
		server.response = { Success: true, Message: "my msg" };

		const cmdResult = await api.postAndWaitAck(new ForgeCommands.EnsureTag({ slug: "my-slug-1" }));

		assert.isDefined(server.lastCall);
		if (!server.lastCall) {
			throw new Error("No calls performed");
		}

		assert.deepEqual(cmdResult, server.response);
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
		assert.equal(server.lastCall.headers.authorization, `GUIShellApp key=${authKey}`);
		assert.equal(server.lastCall.headers["user-agent"], "NodeSDK/" + sdkVersion);
		assert.equal(server.lastCall.headers.accept, "application/json");
	});

	it("get api parse server response as json", async function() {
		server.response = { myResult: "value1" };

		const result = await api.get("/test", { q1: "x"});

		assert.deepEqual(result, server.response);
	});

	it("get api with custom user agent", async function() {
		api = new ForgeManagementApi({
			url: manegementApiUrl,
			authKey,
			userAgent: "MyApp/1.4"
		});

		await api.get("/test", { q1: "x"});

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

class ManagementApiServerStub {
	lastCall?: {
		path: string,
		queryString: any,
		headers: any,
		method: string
	};
	response: any = {};
	responseStatusCode: number = 200;
	responseHeaders: http.OutgoingHttpHeaders = { "Content-Type": "application/json" };
	private srv?: http.Server;

	connect(port: number) {
		this.srv = http.createServer((req, res) => {
			const urlObj = url.parse(req.url || "", true);

			this.lastCall = {
				path: urlObj.pathname || "",
				queryString: urlObj.query || {},
				headers: req.headers || {},
				method: req.method || ""
			};

			res.writeHead(this.responseStatusCode, this.responseHeaders);
			if (this.response) {
				res.end(JSON.stringify(this.response));
			} else {
				res.end();
			}
		});

		return new Promise((resolve, reject) => {
			this.srv!.listen(port, "127.0.0.1", () => {
				resolve();
			});
		});
	}

	disconnect() {
		return new Promise((resolve, reject) => {
			if (!this.srv) {
				return resolve();
			}
			this.srv.close(() => {
				resolve();
			});
		});
	}

	resetCalls(): void {
		this.response = {};
		this.responseStatusCode = 200;
		this.lastCall = undefined;
		this.responseHeaders = { "Content-Type": "application/json" };
	}
}
