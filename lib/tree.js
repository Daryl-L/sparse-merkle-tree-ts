"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const key_1 = require("./branch/key");
const const_1 = require("./const");
const util_1 = require("./merge/util");
const h256_1 = __importDefault(require("./h256"));
const default_store_1 = require("./store/default_store");
const node_1 = require("./branch/node");
const merkle_proof_1 = __importDefault(require("./merkle_proof"));
const errors_1 = require("./errors/errors");
class SparseMerkleTree {
    constructor(hasherFactory) {
        this.store = new default_store_1.DefaultStore;
        this.root = new h256_1.default(const_1.BYTE_NUMBER);
        this.hasherFactory = hasherFactory;
    }
    getRoot() {
        return this.root;
    }
    update(key, value) {
        if (!value.is_zero()) {
            this.store.insert_leaf(key, value);
        }
        else {
            this.store.remove_leaf(key);
        }
        let current_node = (0, util_1.from_h256)(value);
        let current_key = key;
        for (let height = 0; height <= const_1.MAX_HEIGHT; height++) {
            let parent_branch_key = new key_1.BranchKey(height, current_key.parent_path(height));
            let parent_branch_node = this.store.get_branch(parent_branch_key);
            if (parent_branch_node != null) {
                if (current_key.is_right(height)) {
                    parent_branch_node.right = current_node;
                }
                else {
                    parent_branch_node.left = current_node;
                }
            }
            else if (current_key.is_right(height)) {
                parent_branch_node = new node_1.BranchNode((0, util_1.from_h256)(h256_1.default.zero()), current_node);
            }
            else {
                parent_branch_node = new node_1.BranchNode(current_node, (0, util_1.from_h256)(h256_1.default.zero()));
            }
            if (parent_branch_node.left.is_zero() && parent_branch_node.right.is_zero()) {
                this.store.remove_branch(parent_branch_key);
            }
            else {
                this.store.insert_branch(parent_branch_key, parent_branch_node);
            }
            current_key = parent_branch_key.key;
            current_node = (0, util_1.merge)(height, current_key, parent_branch_node.left, parent_branch_node.right, this.hasherFactory);
        }
        this.root = current_node.hash();
        return this.root;
    }
    remove(key) {
        this.update(key, new h256_1.default(32));
        return this.root;
    }
    merkle_proof(keys) {
        if (keys == null || keys.length <= 0) {
            throw new errors_1.EmptyKeys;
        }
        let proof = new merkle_proof_1.default(this.hasherFactory);
        keys = keys.sort();
        keys.forEach((current_key) => {
            let bitmap = h256_1.default.zero();
            for (let height = 0; height < const_1.MAX_HEIGHT; height++) {
                let parent_branch_node = this.store.get_branch(new key_1.BranchKey(height, current_key.parent_path(height)));
                if (parent_branch_node) {
                    let sibling = current_key.is_right(height) ? parent_branch_node.left : parent_branch_node.right;
                    if (!sibling.is_zero()) {
                        bitmap.set_bit(height);
                    }
                }
            }
            proof.leaves_bitmap.push(bitmap);
        });
        let fork_height_stack = new Array();
        let stack_top = 0;
        for (let i = 0; i < keys.length; i++) {
            let leaf_key = keys[i];
            let fork_height = i + 1 < keys.length ? leaf_key.fork_height(keys[i + 1]) : const_1.MAX_HEIGHT;
            for (let height = 0; height <= fork_height; height++) {
                if (height == fork_height && i < keys.length) {
                    break;
                }
                if (stack_top > 0 && height == fork_height_stack[stack_top - 1]) {
                    stack_top--;
                }
                else if (proof.leaves_bitmap[i].get_bit(height) == 1) {
                    let parent_branch_node = this.store.get_branch(new key_1.BranchKey(height, leaf_key.parent_path(height)));
                    let sibling = leaf_key.is_right(height) ? parent_branch_node.left : parent_branch_node.right;
                    if (!sibling.is_zero()) {
                        proof.branch_node.push(sibling);
                    }
                }
            }
            fork_height_stack[stack_top] = fork_height;
            stack_top++;
        }
        return proof;
    }
}
exports.default = SparseMerkleTree;
//# sourceMappingURL=tree.js.map