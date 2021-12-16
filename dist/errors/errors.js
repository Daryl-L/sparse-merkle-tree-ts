System.register([], function (exports_1, context_1) {
    "use strict";
    var CorruptedStackError, CorruptedProofError, IncorrectNumberOfLeaves, EmptyKeys;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            CorruptedStackError = class CorruptedStackError extends Error {
                constructor() {
                    super('Corrupted serialized proof stack');
                }
            };
            exports_1("CorruptedStackError", CorruptedStackError);
            CorruptedProofError = class CorruptedProofError extends Error {
                constructor() {
                    super('Corrupted proof');
                }
            };
            exports_1("CorruptedProofError", CorruptedProofError);
            IncorrectNumberOfLeaves = class IncorrectNumberOfLeaves extends Error {
                constructor(expect, actual) {
                    super('Incorrect number of leaves, expected ' + expect + 'actual ' + actual);
                }
            };
            exports_1("IncorrectNumberOfLeaves", IncorrectNumberOfLeaves);
            EmptyKeys = class EmptyKeys extends Error {
                constructor() {
                    super('Empty Keys');
                }
            };
            exports_1("EmptyKeys", EmptyKeys);
        }
    };
});
//# sourceMappingURL=errors.js.map