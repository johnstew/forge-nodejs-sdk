export function toCamel(o) {
	let build;

	if (o instanceof Array) {
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
