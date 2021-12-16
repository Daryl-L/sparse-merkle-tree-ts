"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmptyKeys = exports.IncorrectNumberOfLeaves = exports.CorruptedProofError = exports.CorruptedStackError = void 0;
class CorruptedStackError extends Error {
    constructor() {
        super('Corrupted serialized proof stack');
    }
}
exports.CorruptedStackError = CorruptedStackError;
class CorruptedProofError extends Error {
    constructor() {
        super('Corrupted proof');
    }
}
exports.CorruptedProofError = CorruptedProofError;
class IncorrectNumberOfLeaves extends Error {
    constructor(expect, actual) {
        super('Incorrect number of leaves, expected ' + expect + 'actual ' + actual);
    }
}
exports.IncorrectNumberOfLeaves = IncorrectNumberOfLeaves;
class EmptyKeys extends Error {
    constructor() {
        super('Empty Keys');
    }
}
exports.EmptyKeys = EmptyKeys;
//# sourceMappingURL=errors.js.map