"use strict";
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
//# sourceMappingURL=utils.js.map