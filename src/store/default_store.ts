import { BranchKey } from "../branch/key";
import { BranchNode } from "../branch/node";
import { Store } from "./store";
import H256 from "../h256";

export class DefaultStore implements Store {
  branch_map: Map<string, BranchNode>;
  leaf_map: Map<string, H256>;

  constructor() {
    this.branch_map = new Map;
    this.leaf_map = new Map;
  }

  clone(): Store {
    let clone = new DefaultStore;
    this.branch_map.forEach((v, k) => {
      clone.branch_map.set(k, v);
    });

    this.leaf_map.forEach((v, k) => {
      clone.leaf_map.set(k, v);
    })

    return clone;
  }

  insert_leaf(key: H256, value: H256) {
    this.leaf_map.set(key.toString(), value);
  }
  remove_leaf(key: H256) {
    this.leaf_map.delete(key.toString());
  }
  insert_branch(key: BranchKey, value: BranchNode) {
    this.branch_map.set(key.toString(), value);
  }
  get_branch(key: BranchKey): BranchNode {
    return this.branch_map.get(key.toString());
  }
  get_leaf(key: H256): H256 {
    return this.leaf_map.get(key.toString());
  }
  remove_branch(key: BranchKey) {
    this.branch_map.delete(key.toString());
  }
}