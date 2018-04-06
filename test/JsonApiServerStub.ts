import * as http from "http";
import * as url from "url";

export class JsonApiServerStub {
	lastCall?: {
		path: string,
		queryString: any,
		headers: any,
		method: string
	};
	responseJsonStringify: boolean = true;
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
				res.end(this.responseJsonStringify
					? JSON.stringify(this.response)
					: this.response);
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
		this.responseJsonStringify = true;
		this.response = {};
		this.responseStatusCode = 200;
		this.lastCall = undefined;
		this.responseHeaders = { "Content-Type": "application/json" };
	}
}
