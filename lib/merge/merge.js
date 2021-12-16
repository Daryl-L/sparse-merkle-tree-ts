"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MergeValueWithZero = exports.MergeValueNormal = void 0;
const h256_1 = __importDefault(require("../h256"));
const const_1 = require("./const");
class MergeValueNormal {
    constructor(value) {
        this.value = value;
    }
    hash() {
        return this.value;
    }
    is_zero() {
        return this.value.is_zero();
    }
}
exports.MergeValueNormal = MergeValueNormal;
class MergeValueWithZero {
    constructor(hasherFactory, base_node, zero_bits, zero_count) {
        this.base_node = base_node;
        this.zero_bits = zero_bits;
        this.zero_count = zero_count;
        this.hasherFactory = hasherFactory;
    }
    hash() {
        let hasher = this.hasherFactory();
        hasher.update(new h256_1.default([const_1.MergeType.MergeWithZero]));
        hasher.update(new h256_1.default(this.base_node));
        hasher.update(new h256_1.default(this.zero_bits));
        hasher.update(new h256_1.default([this.zero_count]));
        return new h256_1.default(hasher.final());
    }
    is_zero() {
        return false;
    }
}
exports.MergeValueWithZero = MergeValueWithZero;
//# sourceMappingURL=merge.js.map