"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const serviceBusBodyParser_1 = require("../src/serviceBus/azure/serviceBusBodyParser");
describe("serviceBusBodyParser", function () {
    const tests = [
        { source: `{"a":1}`, expected: { a: 1 } },
        { source: `x{"a":1}`, expected: { a: 1 } },
        { source: `{"a":1}x`, expected: { a: 1 } },
        { source: `x{"a":1}x`, expected: { a: 1 } },
        { source: `x{x{"a":1}`, expected: { a: 1 } },
        { source: `x{x{"a":1}x}x`, expected: { a: 1 } },
        { source: `{"a":1}x}x`, expected: { a: 1 } },
        { source: `�{♠{"a":1}�}x`, expected: { a: 1 } },
    ];
    tests.forEach(function (test) {
        it(`correctly parse '${test.source}'`, function () {
            const result = serviceBusBodyParser_1.parseJson(test.source);
            chai_1.assert.deepEqual(result, test.expected);
        });
    });
});
