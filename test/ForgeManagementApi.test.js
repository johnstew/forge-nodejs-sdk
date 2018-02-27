"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-implicit-dependencies
const chai_1 = require("chai");
const http = require("http");
const url = require("url");
const ForgeManagementApi_1 = require("../src/ForgeManagementApi");
describe("ForgeManagementApi", function () {
    let server;
    let api;
    const authKey = "xyz";
    const sdkVersion = require("../package.json").version;
    const manegementApiUrl = "http://127.0.0.1:8989/";
    before(function () {
        return __awaiter(this, void 0, void 0, function* () {
            server = new ManagementApiServerStub();
            yield server.connect(8989);
            api = new ForgeManagementApi_1.ForgeManagementApi({
                url: manegementApiUrl,
                authKey
            });
        });
    });
    after(function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield server.disconnect();
        });
    });
    beforeEach(function () {
        server.resetCalls();
    });
    afterEach(function () {
        server.resetCalls();
    });
    it("get api", function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield api.get("/test", { q1: "x" });
            chai_1.assert.isDefined(server.lastCall);
            if (!server.lastCall) {
                throw new Error("No calls performed");
            }
            chai_1.assert.equal(server.lastCall.path, "/test");
            chai_1.assert.equal(server.lastCall.queryString.q1, "x");
            chai_1.assert.equal(server.lastCall.headers.authorization, `GUIShellApp key=${authKey}`);
            chai_1.assert.equal(server.lastCall.headers["user-agent"], "NodeSDK/" + sdkVersion);
        });
    });
    it("get api with custom user agent", function () {
        return __awaiter(this, void 0, void 0, function* () {
            api = new ForgeManagementApi_1.ForgeManagementApi({
                url: manegementApiUrl,
                authKey,
                userAgent: "MyApp/1.4"
            });
            yield api.get("/test", { q1: "x" });
            chai_1.assert.isDefined(server.lastCall);
            if (!server.lastCall) {
                throw new Error("No calls performed");
            }
            chai_1.assert.equal(server.lastCall.path, "/test");
            chai_1.assert.equal(server.lastCall.queryString.q1, "x");
            chai_1.assert.equal(server.lastCall.headers.authorization, `GUIShellApp key=${authKey}`);
            chai_1.assert.equal(server.lastCall.headers["user-agent"], "MyApp/1.4 NodeSDK/" + sdkVersion);
        });
    });
});
class ManagementApiServerStub {
    connect(port) {
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
    resetCalls() {
        this.lastCall = undefined;
    }
}
//# sourceMappingURL=ForgeManagementApi.test.js.map