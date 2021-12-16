"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultStore = void 0;
class DefaultStore {
    constructor() {
        this.branch_map = new Map;
        this.leaf_map = new Map;
    }
    clone() {
        let clone = new DefaultStore;
        this.branch_map.forEach((v, k) => {
            clone.branch_map.set(k, v);
        });
        this.leaf_map.forEach((v, k) => {
            clone.leaf_map.set(k, v);
        });
        return clone;
    }
    insert_leaf(key, value) {
        this.leaf_map.set(key.toString(), value);
    }
    remove_leaf(key) {
        this.leaf_map.delete(key.toString());
    }
    insert_branch(key, value) {
        this.branch_map.set(key.toString(), value);
    }
    get_branch(key) {
        return this.branch_map.get(key.toString());
    }
    get_leaf(key) {
        return this.leaf_map.get(key.toString());
    }
    remove_branch(key) {
        this.branch_map.delete(key.toString());
    }
}
exports.DefaultStore = DefaultStore;
//# sourceMappingURL=default_store.js.map