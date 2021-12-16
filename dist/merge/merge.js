System.register(["@nervosnetwork/ckb-sdk-utils/lib/crypto/blake2b", "../const", "../h256", "./const"], function (exports_1, context_1) {
    "use strict";
    var blake2b_1, const_1, h256_1, const_2, MergeValueNormal, MergeValueWithZero;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (blake2b_1_1) {
                blake2b_1 = blake2b_1_1;
            },
            function (const_1_1) {
                const_1 = const_1_1;
            },
            function (h256_1_1) {
                h256_1 = h256_1_1;
            },
            function (const_2_1) {
                const_2 = const_2_1;
            }
        ],
        execute: function () {
            MergeValueNormal = class MergeValueNormal {
                constructor(value) {
                    this.value = value;
                }
                hash() {
                    return this.value;
                }
                is_zero() {
                    return this.value.is_zero();
                }
            };
            exports_1("MergeValueNormal", MergeValueNormal);
            MergeValueWithZero = class MergeValueWithZero {
                constructor(base_node, zero_bits, zero_count) {
                    this.base_node = base_node;
                    this.zero_bits = zero_bits;
                    this.zero_count = zero_count;
                }
                hash() {
                    let hasher = blake2b_1.default(32, null, null, const_1.PERSONAL);
                    hasher.update(new h256_1.H256([const_2.MergeType.MergeWithZero]));
                    hasher.update(new h256_1.H256(this.base_node));
                    hasher.update(new h256_1.H256(this.zero_bits));
                    hasher.update(new h256_1.H256([this.zero_count]));
                    return new h256_1.H256(hasher.final('binary'));
                }
                is_zero() {
                    return false;
                }
            };
            exports_1("MergeValueWithZero", MergeValueWithZero);
        }
    };
});
//# sourceMappingURL=merge.js.map