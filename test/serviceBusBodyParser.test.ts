import { assert } from "chai";

import { parseJson } from "../src/serviceBus/azure/serviceBusBodyParser";

describe("serviceBusBodyParser", function() {
	const tests = [
		{source: `{"a":1}`,			expected: { a: 1 }},
		{source: `x{"a":1}`,			expected: { a: 1 }},
		{source: `{"a":1}x`,			expected: { a: 1 }},
		{source: `x{"a":1}x`,			expected: { a: 1 }},
		{source: `x{x{"a":1}`,			expected: { a: 1 }},
		{source: `x{x{"a":1}x}x`,			expected: { a: 1 }},
		{source: `{"a":1}x}x`,			expected: { a: 1 }},
		{source: `�{♠{"a":1}�}x`,			expected: { a: 1 }},
	];

	tests.forEach(function(test) {
		it(`correctly parse '${test.source}'`, function() {
			const result = parseJson(test.source);

			assert.deepEqual(result, test.expected);
		});
	});
});
