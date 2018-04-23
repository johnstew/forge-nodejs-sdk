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
const ForgeManagementApi_1 = require("../src/ForgeManagementApi");
const ForgeCommands = require("../src/ForgeCommands");
const JsonApiServerStub_1 = require("./JsonApiServerStub");
describe("ForgeManagementApi", function () {
    let server;
    let api;
    const authKey = "xyz";
    const sdkVersion = require("../package.json").version;
    const manegementApiUrl = "http://127.0.0.1:8989/";
    before(function () {
        return __awaiter(this, void 0, void 0, function* () {
            server = new JsonApiServerStub_1.JsonApiServerStub();
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
    it("post command calls server", function () {
        return __awaiter(this, void 0, void 0, function* () {
            server.responseStatusCode = 204;
            server.responseHeaders = {};
            server.response = undefined;
            const cmdResult = yield api.post(new ForgeCommands.EnsureTag({ slug: "my-slug-1" }));
            chai_1.assert.isDefined(server.lastCall);
            if (!server.lastCall) {
                throw new Error("No calls performed");
            }
            chai_1.assert.equal(server.lastCall.method, "POST");
            chai_1.assert.equal(server.lastCall.headers.authorization, `GUIShellApp key=${authKey}`);
            chai_1.assert.equal(server.lastCall.headers["user-agent"], "NodeSDK/" + sdkVersion);
            chai_1.assert.equal(server.lastCall.headers.accept, "application/json");
            chai_1.assert.equal(server.lastCall.headers["content-type"], "application/json");
        });
    });
    it("post command fail if status code is not 200 and error msg is returned", function () {
        return __awaiter(this, void 0, void 0, function* () {
            server.responseStatusCode = 500;
            server.response = { Message: "my-msg" };
            try {
                yield api.post(new ForgeCommands.EnsureTag({ slug: "my-slug-1" }));
            }
            catch (err) {
                chai_1.assert.equal(err.message, "500 my-msg");
                return;
            }
            throw new Error("Expected to fail");
        });
    });
    it("post command fail if status code is not 200 and error response is not a json", function () {
        return __awaiter(this, void 0, void 0, function* () {
            server.responseStatusCode = 500;
            server.response = "bla bla bla";
            try {
                yield api.post(new ForgeCommands.EnsureTag({ slug: "my-slug-1" }));
            }
            catch (err) {
                chai_1.assert.equal(err.message, "500 Internal Server Error");
                return;
            }
            throw new Error("Expected to fail");
        });
    });
    it("post command fail if status code is not 200 and error response is not a json content", function () {
        return __awaiter(this, void 0, void 0, function* () {
            server.responseStatusCode = 500;
            server.responseHeaders = { "Content-Type": "text" };
            try {
                yield api.post(new ForgeCommands.EnsureTag({ slug: "my-slug-1" }));
            }
            catch (err) {
                chai_1.assert.equal(err.message, "500 Internal Server Error");
                return;
            }
            throw new Error("Expected to fail");
        });
    });
    it("post command fail if name is not resolved", function () {
        return __awaiter(this, void 0, void 0, function* () {
            const apiFail = new ForgeManagementApi_1.ForgeManagementApi({
                url: "http://some-not-existing-url",
                authKey
            });
            try {
                yield apiFail.post(new ForgeCommands.EnsureTag({ slug: "my-slug-1" }));
            }
            catch (err) {
                chai_1.assert.isTrue(err.message.includes("ENOTFOUND"));
                return;
            }
            throw new Error("Expected to fail");
        });
    });
    it("post command calls server and fill command values", function () {
        return __awaiter(this, void 0, void 0, function* () {
            const cmdResult = yield api.post(new ForgeCommands.EnsureTag({ slug: "my-slug-1" }));
            chai_1.assert.isDefined(server.lastCall);
            if (!server.lastCall) {
                throw new Error("No calls performed");
            }
            chai_1.assert.isString(cmdResult.commandId);
        });
    });
    it("post ack command calls server and parse the result", function () {
        return __awaiter(this, void 0, void 0, function* () {
            const command = new ForgeCommands.EnsureTag({ slug: "my-slug-1" });
            server.response = { Success: true, Message: "my msg" };
            const cmdResult = yield api.postAndWaitAck(command);
            chai_1.assert.isDefined(server.lastCall);
            if (!server.lastCall) {
                throw new Error("No calls performed");
            }
            chai_1.assert.deepEqual(cmdResult, command.bodyObject);
        });
    });
    it("post ack command throws when server response has succes equal to false", function () {
        return __awaiter(this, void 0, void 0, function* () {
            const command = new ForgeCommands.EnsureTag({ slug: "my-slug-1" });
            server.response = { Success: false, Message: "my error message" };
            try {
                yield api.postAndWaitAck(command);
            }
            catch (e) {
                chai_1.assert.isDefined(server.lastCall);
                if (!server.lastCall) {
                    throw new Error("No calls performed");
                }
                chai_1.assert.strictEqual(e.message, "my error message");
                return;
            }
            throw new Error("Exception was expected.");
        });
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
            const apiFail = new ForgeManagementApi_1.ForgeManagementApi({
                url: "http://some-not-existing-url",
                authKey
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
            chai_1.assert.equal(server.lastCall.headers.authorization, `GUIShellApp key=${authKey}`);
            chai_1.assert.equal(server.lastCall.headers["user-agent"], "NodeSDK/" + sdkVersion);
            chai_1.assert.equal(server.lastCall.headers.accept, "application/json");
        });
    });
    it("get api parse server response as json", function () {
        return __awaiter(this, void 0, void 0, function* () {
            server.response = { myResult: "value1" };
            const result = yield api.get("/test", { q1: "x" });
            chai_1.assert.deepEqual(result, server.response);
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
//# sourceMappingURL=ForgeManagementApi.test.js.map