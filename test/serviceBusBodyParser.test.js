"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-implicit-dependencies
const chai_1 = require("chai");
const serviceBusBodyParser_1 = require("../src/serviceBus/azure/serviceBusBodyParser");
describe("serviceBusBodyParser", function () {
    const tests = [
        { source: `{"a":1}`, expected: { a: 1 } },
        { source: `\r\n{\r\n"a":1\r\n}\r\n`, expected: { a: 1 } },
        { source: `x{"a":1}`, expected: { a: 1 } },
        { source: `{"a":1}x`, expected: { a: 1 } },
        { source: `x{"a":1}x`, expected: { a: 1 } },
        { source: `x{x{"a":1}`, expected: { a: 1 } },
        { source: `x{x{"a":1}x}x`, expected: { a: 1 } },
        { source: `{"a":1}x}x`, expected: { a: 1 } },
        { source: `�{♠{"a":1}�}x`, expected: { a: 1 } },
        { source: `�{\r{"a":1}\n}x`, expected: { a: 1 } },
        { source: `\t{\r{"a":1}}\t`, expected: { a: 1 } },
        { source: `x{"a":{"b":1}}x`, expected: { a: { b: 1 } } },
        { source: `x{x{"a":{"b":1}}x}x`, expected: { a: { b: 1 } } },
    ];
    tests.forEach(function (test) {
        it(`correctly parse '${test.source}'`, function () {
            const result = serviceBusBodyParser_1.parseJson(test.source);
            chai_1.assert.deepEqual(result, test.expected);
        });
    });
});
//# sourceMappingURL=serviceBusBodyParser.test.js.map