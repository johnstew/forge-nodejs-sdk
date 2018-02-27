// tslint:disable-next-line:no-implicit-dependencies
import { assert } from "chai";

import * as http from "http";
import * as url from "url";
import { ForgeManagementApi } from "../src/ForgeManagementApi";

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

	it("get api", async function() {
		await api.get("/test", { q1: "x"});

		assert.isDefined(server.lastCall);
		if (!server.lastCall) {
			throw new Error("No calls performed");
		}
		assert.equal(server.lastCall.path, "/test");
		assert.equal(server.lastCall.queryString.q1, "x");
		assert.equal(server.lastCall.headers.authorization, `GUIShellApp key=${authKey}`);
		assert.equal(server.lastCall.headers["user-agent"], "NodeSDK/" + sdkVersion);
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
		headers: any
	};
	private srv: http.Server;

	connect(port: number) {
		this.srv = http.createServer((req, res) => {
			const urlObj = url.parse(req.url || "", true);

			this.lastCall = {
				path: urlObj.pathname || "",
				queryString: urlObj.query || {},
				headers: req.headers || {}
			};

			res.writeHead(200, { "Content-Type": "application/json" });
			res.end("{}");
		});

		return new Promise((resolve, reject) => {
			this.srv.listen(port, "127.0.0.1", () => {
				resolve();
			});
		});
	}

	disconnect() {
		return new Promise((resolve, reject) => {
			this.srv.close(() => {
				resolve();
			});
		});
	}

	resetCalls(): void {
		this.lastCall = undefined;
	}
}
