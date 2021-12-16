System.register(["@nervosnetwork/ckb-sdk-utils", "../const", "../h256", "./const", "./merge"], function (exports_1, context_1) {
    "use strict";
    var util, const_1, h256_1, const_2, merge_1, merge, merge_with_zero, from_h256;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (util_1) {
                util = util_1;
            },
            function (const_1_1) {
                const_1 = const_1_1;
            },
            function (h256_1_1) {
                h256_1 = h256_1_1;
            },
            function (const_2_1) {
                const_2 = const_2_1;
            },
            function (merge_1_1) {
                merge_1 = merge_1_1;
            }
        ],
        execute: function () {
            exports_1("merge", merge = (height, node_key, left, right) => {
                if (left.is_zero() && right.is_zero()) {
                    return new merge_1.MergeValueNormal(h256_1.H256.zero());
                }
                if (left.is_zero()) {
                    return merge_with_zero(height, node_key, right, true);
                }
                if (right.is_zero()) {
                    return merge_with_zero(height, node_key, left, false);
                }
                let hasher = util.blake2b(32, null, null, const_1.PERSONAL);
                hasher
                    .update(new h256_1.H256([const_2.MergeType.MergeNormal]))
                    .update(new h256_1.H256([height]))
                    .update(node_key)
                    .update(left.hash())
                    .update(right.hash());
                return from_h256(new h256_1.H256(hasher.final('binary')));
            });
            merge_with_zero = (height, node_key, value, set_bit) => {
                let res = new merge_1.MergeValueWithZero;
                if (value instanceof merge_1.MergeValueWithZero) {
                    res.base_node = value.base_node;
                    let zero_bits = new h256_1.H256(value.zero_bits);
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
                    res.zero_bits = h256_1.H256.zero();
                    if (set_bit) {
                        res.zero_bits.set_bit(height);
                    }
                    res.base_node = new h256_1.H256(util
                        .blake2b(32, null, null, const_1.PERSONAL)
                        .update(new h256_1.H256([height]))
                        .update(node_key)
                        .update(value.value)
                        .final('binary'));
                    res.zero_count = 1;
                }
                return res;
            };
            exports_1("from_h256", from_h256 = (value) => {
                return new merge_1.MergeValueNormal(value);
            });
        }
    };
});
//# sourceMappingURL=util.js.map