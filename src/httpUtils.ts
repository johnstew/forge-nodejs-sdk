import {Response} from "node-fetch";
import * as http from "http";
import * as https from "https";

// Suggested value for Azure to prevent ETIMEDOUT errors (timeout), usually when multiple connections/requests are performed
// because the default agent (globalAgent) use an infinite number of socket connections and on Azure they are limited.
// https://docs.microsoft.com/en-us/azure/app-service/app-service-web-nodejs-best-practices-and-troubleshoot-guide#my-node-application-is-making-too-many-outbound-calls
// https://nodejs.org/api/http.html#http_new_agent_options
export function createAgent(baseUrl: string): http.Agent | undefined {
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

	const opts: http.AgentOptions = {
		keepAlive,
		// keepAliveMsecs: 1000,
		maxSockets,
		// maxFreeSockets: 10
	};
	if (baseUrl.toLowerCase().startsWith("https")) {
		return new https.Agent(opts);
	} else {
		return new http.Agent(opts);
	}
}

export async function handleEmptyResponse(response: Response) {
	if (!response) {
		throw new Error("Invalid response");
	}

	if (response.ok) {
		return;
	}

	await handleErrorResponse(response);
}

export async function handleJsonResponse(response: Response) {
	if (!response) {
		throw new Error("Invalid response");
	}

	if (response.ok) {
		return response.json();
	}

	await handleErrorResponse(response);
}

export async function handleTextResponse(response: Response) {
	if (!response) {
		throw new Error("Invalid response");
	}

	if (response.ok) {
		return response.text();
	}

	await handleErrorResponse(response);
}

async function handleErrorResponse(response: Response) {
	let error = new Error(`${response.status} ${response.statusText || "Unknown error"}`);
	try {
		const responseCt = response.headers.get("content-type");
		if (responseCt && responseCt.includes("json")) {
			const jsonResult = await response.json();
			error = new Error(`${response.status} ${jsonResult.Message || response.statusText || "Unknown error"}`);
		}
	}	catch (_) {
		// ignore
	}
	throw error;
}
