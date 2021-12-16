System.register(["./const"], function (exports_1, context_1) {
    "use strict";
    var const_1, H256;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (const_1_1) {
                const_1 = const_1_1;
            }
        ],
        execute: function () {
            H256 = class H256 extends Uint8Array {
                static zero() {
                    return new H256(const_1.BYTE_NUMBER);
                }
                is_zero() {
                    for (const i of this) {
                        if (i != 0) {
                            return false;
                        }
                    }
                    return true;
                }
                is_right(height) {
                    return this.get_bit(height) == 0x1;
                }
                get_bit(height) {
                    return (this[Math.floor(height / 8)] >> height % 8 & 0x1);
                }
                fork_height(next_key) {
                    for (let height = const_1.MAX_HEIGHT; height >= 0; height--) {
                        if (this.get_bit(height) != next_key.get_bit(height)) {
                            return height;
                        }
                    }
                    return 0;
                }
                set_bit(height) {
                    this[Math.floor(height / 8)] |= 1 << (height % 8);
                }
                to_array() {
                    let arr = new Array;
                    this.forEach((v) => {
                        arr.push(v);
                    });
                    return arr;
                }
                parent_path(height) {
                    let start = height + 1;
                    let start_byte = Math.floor(start / 8);
                    let clone = H256.zero();
                    clone.set(new H256(this).slice(start_byte), start_byte);
                    clone[start_byte] &= (0xff << start % 8);
                    return clone;
                }
            };
            exports_1("H256", H256);
        }
    };
});
//# sourceMappingURL=h256.js.map