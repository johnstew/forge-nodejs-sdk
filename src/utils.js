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
function toCamel(o) {
    let build;
    if (Array.isArray(o)) {
        build = [];
        for (const key in o) {
            if (o.hasOwnProperty(key)) {
                let value = o[key];
                if (typeof value === "object") {
                    value = toCamel(value);
                }
                build.push(value);
            }
        }
    }
    else {
        build = {};
        for (const key in o) {
            if (o.hasOwnProperty(key)) {
                const destKey = (key.charAt(0).toLowerCase() + key.slice(1) || key).toString();
                let value = o[key];
                if (value !== null && typeof value === "object") {
                    value = toCamel(value);
                }
                build[destKey] = value;
            }
        }
    }
    return build;
}
exports.toCamel = toCamel;
class TimeoutError extends Error {
    constructor(msg) {
        super(msg);
        this.isTimeout = true;
    }
}
exports.TimeoutError = TimeoutError;
function withTimeout(p, ms) {
    const timeout = new Promise((resolve, reject) => {
        const timeoutError = new TimeoutError("Timeout");
        const tId = setTimeout(reject, ms, timeoutError);
        const clearTimeoutFunc = () => clearTimeout(tId);
        p.then(clearTimeoutFunc, clearTimeoutFunc);
    });
    return Promise.race([p, timeout]);
}
exports.withTimeout = withTimeout;
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
function handleErrorResponse(response) {
    return __awaiter(this, void 0, void 0, function* () {
        let error = new Error(`${response.status} ${response.statusText || "Unknown error"}`);
        try {
            const responseCt = response.headers.get("content-type");
            if (responseCt.includes("json")) {
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
//# sourceMappingURL=utils.js.map