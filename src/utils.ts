import {Response} from "node-fetch";

export function toCamel(o: any) {
	let build: any;

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
	} else {
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

export class TimeoutError extends Error {
	readonly isTimeout = true;

	constructor(msg: string) {
		super(msg);
	}
}

export function withTimeout(p: Promise<any>, ms: number) {
	const timeout = new Promise((resolve, reject) => {
		const timeoutError = new TimeoutError("Timeout");

		const tId = setTimeout(reject, ms, timeoutError);
		const clearTimeoutFunc = () => clearTimeout(tId);
		p.then(clearTimeoutFunc, clearTimeoutFunc);
	});

	return Promise.race([p, timeout]);
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

async function handleErrorResponse(response: Response) {
	let error = new Error(`${response.status} ${response.statusText || "Unknown error"}`);
	try {
		const responseCt = response.headers.get("content-type");
		if (responseCt.includes("json")) {
			const jsonResult = await response.json();
			error = new Error(`${response.status} ${jsonResult.Message || response.statusText || "Unknown error"}`);
		}
	}	catch (_) {
		// ignore
	}
	throw error;
}
