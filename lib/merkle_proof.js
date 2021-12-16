"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const const_1 = require("./const");
const errors_1 = require("./errors/errors");
const h256_1 = __importDefault(require("./h256"));
const merge_1 = require("./merge/merge");
const util_1 = require("./merge/util");
class MerkleProof {
    constructor() {
        this.leaves_bitmap = new Array;
        this.branch_node = new Array;
    }
    compute_root(leaves) {
        return this.compile(leaves).compute_root(leaves);
    }
    compile(leaves) {
        if (leaves.length <= 0) {
            throw new errors_1.EmptyKeys;
        }
        else if (leaves.length != this.leaves_bitmap.length) {
            throw new errors_1.IncorrectNumberOfLeaves(leaves.length, this.leaves_bitmap.length);
        }
        leaves.sort();
        let proof = new CompiledMerkleProof;
        let fork_height_stack = new Array(257);
        let stack_top = 0;
        let branch_node_index = 0;
        for (let i = 0; i < leaves.length; i++) {
            let leaf_key = leaves[0][0];
            let leaf_value = leaves[0][1];
            let fork_height = i + 1 < leaves.length ? leaf_key.fork_height(leaves[i + 1][0]) : const_1.MAX_HEIGHT;
            let op_code = 0;
            let op_data = null;
            proof.push(0x4c);
            let zero_count = 0;
            for (let height = 0; height <= fork_height; height++) {
                op_code = 0;
                op_data = null;
                if (height == fork_height && i + 1 < leaves.length) {
                    break;
                }
                if (stack_top > 0 && fork_height_stack[stack_top - 1] == height) {
                    stack_top--;
                    op_code = 0x48;
                }
                else if (this.leaves_bitmap[i].get_bit(height) == 1) {
                    let sibling = this.branch_node[branch_node_index];
                    branch_node_index++;
                    if (sibling instanceof merge_1.MergeValueNormal) {
                        op_code = 0x50;
                        op_data = sibling.hash().to_array();
                    }
                    else if (sibling instanceof merge_1.MergeValueWithZero) {
                        op_code = 0x51;
                        op_data = new Array;
                        op_data.push(sibling.zero_count);
                        op_data.push(...sibling.base_node.to_array());
                        op_data.push(...sibling.zero_bits.to_array());
                    }
                }
                else {
                    zero_count++;
                    if (zero_count > 256) {
                        throw new errors_1.CorruptedProofError;
                    }
                }
                if (op_code != 0) {
                    if (zero_count > 0) {
                        proof.push(0x4f);
                        if (zero_count == 256) {
                            proof.push(0);
                        }
                        else {
                            proof.push(zero_count);
                        }
                        zero_count = 0;
                    }
                    proof.push(op_code);
                    if (op_data != null) {
                        proof.push(...op_data);
                    }
                }
            }
            if (zero_count > 0) {
                proof.push(0x4f);
                if (zero_count == 256) {
                    proof.push(0);
                }
                else {
                    proof.push(zero_count);
                }
            }
            fork_height_stack[stack_top] = fork_height;
            stack_top++;
        }
        return proof;
    }
}
class CompiledMerkleProof extends Array {
    compute_root(leaves) {
        let stack = new Array;
        leaves.sort();
        let leaf_index = 0;
        let pc = 0;
        while (pc < this.length) {
            let code = this[pc++];
            let height, key, value;
            let sibling, parent_key, parent;
            let zero_count;
            switch (code) {
                case 0x4c:
                    if (leaf_index >= leaves.length) {
                        throw new errors_1.CorruptedStackError;
                    }
                    stack.push([0, leaves[leaf_index][0], (0, util_1.from_h256)(leaves[leaf_index][1])]);
                    leaf_index++;
                    break;
                case 0x50:
                    if (stack.length == 0) {
                        throw new errors_1.CorruptedStackError;
                    }
                    if (pc + 32 > this.length) {
                        throw new errors_1.CorruptedStackError;
                    }
                    let data = new h256_1.default(this.slice(pc, pc += 32));
                    sibling = (0, util_1.from_h256)(data);
                    [height, key, value] = stack.pop();
                    if (height > const_1.MAX_HEIGHT) {
                        throw new errors_1.CorruptedProofError;
                    }
                    parent_key = key.parent_path(height);
                    parent = (() => {
                        if (key.is_right) {
                            return (0, util_1.merge)(height, parent_key, sibling, value);
                        }
                        else {
                            return (0, util_1.merge)(height, parent_key, value, sibling);
                        }
                    })();
                    stack.push([height + 1, parent_key, parent]);
                    break;
                case 0x51:
                    if (stack.length == 0) {
                        throw new errors_1.CorruptedStackError;
                    }
                    if (pc + 65 > this.length) {
                        throw new errors_1.CorruptedStackError;
                    }
                    zero_count = this[pc++];
                    let base_node = new h256_1.default(this.slice(pc, pc += 32));
                    let zero_bits = new h256_1.default(this.slice(pc, pc += 32));
                    [height, key, value] = stack.pop();
                    if (height > const_1.MAX_HEIGHT) {
                        throw new errors_1.CorruptedProofError;
                    }
                    parent_key = key.parent_path(height);
                    sibling = new merge_1.MergeValueWithZero(base_node, zero_bits, zero_count);
                    parent = (() => {
                        if (key.is_right(height)) {
                            return (0, util_1.merge)(height, parent_key, sibling, value);
                        }
                        else {
                            return (0, util_1.merge)(height, parent_key, value, sibling);
                        }
                    })();
                    stack.push([height + 1, parent_key, parent]);
                    break;
                case 0x48:
                    if (stack.length < 2) {
                        throw new errors_1.CorruptedStackError;
                    }
                    let height_a, key_a, value_a;
                    let height_b, key_b, value_b;
                    [height_a, key_a, value_a] = stack.pop();
                    [height_b, key_b, value_b] = stack.pop();
                    if (height_a > const_1.MAX_HEIGHT || height_b > const_1.MAX_HEIGHT) {
                        throw new errors_1.CorruptedProofError;
                    }
                    parent_key = key_a.parent_path(height_a);
                    if (parent_key != key_b.parent_path(height_b)) {
                        throw new errors_1.CorruptedProofError;
                    }
                    parent = (() => {
                        if (key_a.is_right(height_a)) {
                            return (0, util_1.merge)(height_a, parent_key, value_b, value_a);
                        }
                        else {
                            return (0, util_1.merge)(height_b, parent_key, value_a, value_b);
                        }
                    })();
                    stack.push([height_a + 1, parent_key, parent]);
                    break;
                case 0x4f:
                    if (stack.length == 0) {
                        throw new errors_1.CorruptedStackError;
                    }
                    if (pc >= this.length) {
                        throw new errors_1.CorruptedProofError;
                    }
                    let n = this[pc] == 0 ? 256 : this[pc++];
                    [height, key, value] = stack.pop();
                    if (height > const_1.MAX_HEIGHT) {
                        throw new errors_1.CorruptedProofError;
                    }
                    for (let i = 0; i < n; i++) {
                        if (height + i > const_1.MAX_HEIGHT) {
                            throw new errors_1.CorruptedProofError;
                        }
                        value = ((height) => {
                            parent_key = key.parent_path(height);
                            if (key.is_right(height)) {
                                return (0, util_1.merge)(height, parent_key, new merge_1.MergeValueNormal(h256_1.default.zero()), value);
                            }
                            else {
                                return (0, util_1.merge)(height, parent_key, value, new merge_1.MergeValueNormal(h256_1.default.zero()));
                            }
                        })(height + i);
                    }
                    stack.push([height + n, parent_key, value]);
            }
        }
        if (stack.length != 1) {
            throw new errors_1.CorruptedStackError;
        }
        if (stack[0][0] != 256) {
            throw new errors_1.CorruptedProofError;
        }
        if (leaf_index != leaves.length) {
            throw new errors_1.CorruptedProofError;
        }
        return stack[0][2].hash();
    }
}
exports.default = MerkleProof;
//# sourceMappingURL=merkle_proof.js.map