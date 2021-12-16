"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.from_h256 = exports.merge = void 0;
const util = __importStar(require("@nervosnetwork/ckb-sdk-utils"));
const const_1 = require("../const");
const h256_1 = __importDefault(require("../h256"));
const const_2 = require("./const");
const merge_1 = require("./merge");
const merge = (height, node_key, left, right) => {
    if (left.is_zero() && right.is_zero()) {
        return new merge_1.MergeValueNormal(h256_1.default.zero());
    }
    if (left.is_zero()) {
        return merge_with_zero(height, node_key, right, true);
    }
    if (right.is_zero()) {
        return merge_with_zero(height, node_key, left, false);
    }
    let hasher = util.blake2b(32, null, null, const_1.PERSONAL);
    hasher
        .update(new h256_1.default([const_2.MergeType.MergeNormal]))
        .update(new h256_1.default([height]))
        .update(node_key)
        .update(left.hash())
        .update(right.hash());
    return (0, exports.from_h256)(new h256_1.default(hasher.final('binary')));
};
exports.merge = merge;
const merge_with_zero = (height, node_key, value, set_bit) => {
    let res = new merge_1.MergeValueWithZero;
    if (value instanceof merge_1.MergeValueWithZero) {
        res.base_node = value.base_node;
        let zero_bits = new h256_1.default(value.zero_bits);
        if (set_bit) {
            zero_bits.set_bit(height);
        }
        res.zero_bits = zero_bits;
        if (value.zero_count == 255) {
            res.zero_count = 0;
        }
        else {
            res.zero_count = value.zero_count + 1;
        }
    }
    if (value instanceof merge_1.MergeValueNormal) {
        res.zero_bits = h256_1.default.zero();
        if (set_bit) {
            res.zero_bits.set_bit(height);
        }
        res.base_node = new h256_1.default(util
            .blake2b(32, null, null, const_1.PERSONAL)
            .update(new h256_1.default([height]))
            .update(node_key)
            .update(value.value)
            .final('binary'));
        res.zero_count = 1;
    }
    return res;
};
const from_h256 = (value) => {
    return new merge_1.MergeValueNormal(value);
};
exports.from_h256 = from_h256;
//# sourceMappingURL=util.js.map