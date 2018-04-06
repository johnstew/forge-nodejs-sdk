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
const ForgeDistributionApi_1 = require("../src/ForgeDistributionApi");
const JsonApiServerStub_1 = require("./JsonApiServerStub");
describe("ForgeDistributionApi", function () {
    let server;
    let api;
    const distApiUrl = "http://127.0.0.1:8989/";
    before(function () {
        return __awaiter(this, void 0, void 0, function* () {
            server = new JsonApiServerStub_1.JsonApiServerStub();
            yield server.connect(8989);
            api = new ForgeDistributionApi_1.ForgeDistributionApi({
                url: distApiUrl
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
    it("get api calls server", function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield api.get("/test1/test2");
            chai_1.assert.isDefined(server.lastCall);
            if (!server.lastCall) {
                throw new Error("No calls performed");
            }
            chai_1.assert.equal(server.lastCall.path, "/test1/test2");
            chai_1.assert.equal(server.lastCall.method, "GET");
        });
    });
    it("get api fail if status code is not 200 and error msg is returned", function () {
        return __awaiter(this, void 0, void 0, function* () {
            server.responseStatusCode = 500;
            server.response = { Message: "my-msg" };
            try {
                yield api.get("/");
            }
            catch (err) {
                chai_1.assert.equal(err.message, "500 my-msg");
                return;
            }
            throw new Error("Expected to fail");
        });
    });
    it("get api fail if status code is not 200 and error response is not a json", function () {
        return __awaiter(this, void 0, void 0, function* () {
            server.responseStatusCode = 500;
            server.response = "bla bla bla";
            try {
                yield api.get("/");
            }
            catch (err) {
                chai_1.assert.equal(err.message, "500 Internal Server Error");
                return;
            }
            throw new Error("Expected to fail");
        });
    });
    it("get api fail if status code is not 200 and error response is not a json content", function () {
        return __awaiter(this, void 0, void 0, function* () {
            server.responseStatusCode = 500;
            server.responseHeaders = { "Content-Type": "text" };
            try {
                yield api.get("/");
            }
            catch (err) {
                chai_1.assert.equal(err.message, "500 Internal Server Error");
                return;
            }
            throw new Error("Expected to fail");
        });
    });
    it("get api fail if name is not resolved", function () {
        return __awaiter(this, void 0, void 0, function* () {
            const apiFail = new ForgeDistributionApi_1.ForgeDistributionApi({
                url: "http://some-not-existing-url"
            });
            try {
                yield apiFail.get("/");
            }
            catch (err) {
                chai_1.assert.isTrue(err.message.includes("ENOTFOUND"));
                return;
            }
            throw new Error("Expected to fail");
        });
    });
    it("get api calls server with query string", function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield api.get("/test", { q1: "x" });
            chai_1.assert.isDefined(server.lastCall);
            if (!server.lastCall) {
                throw new Error("No calls performed");
            }
            chai_1.assert.equal(server.lastCall.path, "/test");
            chai_1.assert.equal(server.lastCall.queryString.q1, "x");
        });
    });
    it("get api calls server with headers", function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield api.get("/test", { q1: "x" });
            chai_1.assert.isDefined(server.lastCall);
            if (!server.lastCall) {
                throw new Error("No calls performed");
            }
            chai_1.assert.isUndefined(server.lastCall.headers.authorization);
            // assert.equal(server.lastCall.headers["user-agent"], "NodeSDK/" + sdkVersion);
            chai_1.assert.equal(server.lastCall.headers.accept, "application/json");
            chai_1.assert.equal(server.lastCall.headers["x-read-source"], "Default");
        });
    });
    it("get api parse server response as json", function () {
        return __awaiter(this, void 0, void 0, function* () {
            server.response = { myResult: "value1" };
            const result = yield api.get("/test", { q1: "x" });
            chai_1.assert.deepEqual(result, server.response);
        });
    });
    it("get stories api use default version", function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield api.getStories("en-us");
            chai_1.assert.isDefined(server.lastCall);
            if (!server.lastCall) {
                throw new Error("No calls performed");
            }
            chai_1.assert.equal(server.lastCall.path, `/v2/content/en-us/stories`);
        });
    });
});
//# sourceMappingURL=ForgeDistributionApi.test.js.map