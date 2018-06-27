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
const http = require("http");
const https = require("https");
// Suggested value for Azure to prevent ETIMEDOUT errors (timeout), usually when multiple connections/requests are performed
// because the default agent (globalAgent) use an infinite number of socket connections and on Azure they are limited.
// https://docs.microsoft.com/en-us/azure/app-service/app-service-web-nodejs-best-practices-and-troubleshoot-guide#my-node-application-is-making-too-many-outbound-calls
// https://nodejs.org/api/http.html#http_new_agent_options
function createAgent(baseUrl) {
    let maxSockets = parseInt(process.env.FORGE_SDK_MAX_SOCKETS || "0", 10);
    const keepAlive = process.env.FORGE_SDK_KEEP_ALIVE ? true : false;
    if (isNaN(maxSockets)) {
        maxSockets = 0;
    }
    if (!keepAlive && maxSockets <= 0) {
        // implicitly use the default globalAgent (infinite sockets)
        return undefined;
    }
    if (maxSockets <= 0) {
        maxSockets = 100;
    }
    const opts = {
        keepAlive,
        // keepAliveMsecs: 1000,
        maxSockets,
    };
    if (baseUrl.toLowerCase().startsWith("https")) {
        return new https.Agent(opts);
    }
    else {
        return new http.Agent(opts);
    }
}
exports.createAgent = createAgent;
function handleEmptyResponse(response) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!response) {
            throw new Error("Invalid response");
        }
        if (response.ok) {
            return;
        }
        yield handleErrorResponse(response);
    });
}
exports.handleEmptyResponse = handleEmptyResponse;
function handleJsonResponse(response) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!response) {
            throw new Error("Invalid response");
        }
        if (response.ok) {
            return response.json();
        }
        yield handleErrorResponse(response);
    });
}
exports.handleJsonResponse = handleJsonResponse;
function handleTextResponse(response) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!response) {
            throw new Error("Invalid response");
        }
        if (response.ok) {
            return response.text();
        }
        yield handleErrorResponse(response);
    });
}
exports.handleTextResponse = handleTextResponse;
function handleErrorResponse(response) {
    return __awaiter(this, void 0, void 0, function* () {
        let error = new Error(`${response.status} ${response.statusText || "Unknown error"}`);
        try {
            const responseCt = response.headers.get("content-type");
            if (responseCt && responseCt.includes("json")) {
                const jsonResult = yield response.json();
                error = new Error(`${response.status} ${jsonResult.Message || response.statusText || "Unknown error"}`);
            }
        }
        catch (_) {
            // ignore
        }
        throw error;
    });
}
//# sourceMappingURL=httpUtils.js.map