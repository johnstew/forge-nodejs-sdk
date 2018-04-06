"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const url = require("url");
class JsonApiServerStub {
    constructor() {
        this.responseJsonStringify = true;
        this.response = {};
        this.responseStatusCode = 200;
        this.responseHeaders = { "Content-Type": "application/json" };
    }
    connect(port) {
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
                res.end(this.responseJsonStringify
                    ? JSON.stringify(this.response)
                    : this.response);
            }
            else {
                res.end();
            }
        });
        return new Promise((resolve, reject) => {
            this.srv.listen(port, "127.0.0.1", () => {
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
    resetCalls() {
        this.responseJsonStringify = true;
        this.response = {};
        this.responseStatusCode = 200;
        this.lastCall = undefined;
        this.responseHeaders = { "Content-Type": "application/json" };
    }
}
exports.JsonApiServerStub = JsonApiServerStub;
//# sourceMappingURL=JsonApiServerStub.js.map