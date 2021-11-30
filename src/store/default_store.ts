import { BranchKey } from "../branch/key";
import { BranchNode } from "../branch/node";
import { Store } from "./store";

export class DefaultStore implements Store {
  branch_map: Map<BranchKey, BranchNode>;
  leaf_map: Map<H256, H256>;

  insert_leaf(key: H256, value: H256) {
    this.leaf_map.set(key, value);
  }
  remove_leaf(key: H256) {
    this.leaf_map.delete(key);
  }
  insert_branch(key: BranchKey, value: BranchNode) {
    this.branch_map.set(key, value);
  }
  get_branch(key: BranchKey): BranchNode {
    return this.branch_map.get(key);
  }
  get_leaf(key: H256): H256 {
    return this.leaf_map.get(key);
  }
  remove_branch(key: BranchKey) {
    this.branch_map.delete(key);
  }
}