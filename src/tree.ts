import { BranchKey } from "./branch/key";
import { BYTE_NUMBER, MAX_HEIGHT } from "./const";
import { from_h256, merge } from "./merge/util";
import { Store } from "./store/store";
import { u8 } from "./u8";
import { H256 } from "./h256";
import { DefaultStore } from "./store/default_store";
import { BranchNode } from "./branch/node";

class SparseMerkleTree {
  store: Store;
  root: H256;

  constructor() {
      this.store = new DefaultStore;
      this.root = new H256(BYTE_NUMBER);
  }


  /**
   * getRoot
   * 
   * @returns 
   */
  getRoot() : H256 {
    return this.root;
  }

  /**
   * 
   * @param key 
   * @param value
   * 
   * @returns H256
   */
  update(key: H256, value: H256): H256 {
    if (!value.is_zero()) {
      this.store.insert_leaf(key, value);
    } else {
      this.store.remove_leaf(key);
    }

    let current_node = from_h256(value);
    let current_key = key;
    for (let height: u8 = 0; height <= MAX_HEIGHT; height++) {
      let parent_branch_key = new BranchKey(
        height as u8,
        current_key.parent_path(height as u8),
      )

      let parent_branch_node = this.store.get_branch(parent_branch_key);
      if (parent_branch_node != null) {
        if (current_key.is_right(height as u8)) {
          parent_branch_node.right = current_node;
        } else {
          parent_branch_node.left = current_node;
        }
      } else if (current_key.is_right(height as u8)) {
        parent_branch_node = new BranchNode(
          from_h256(H256.zero()),
          current_node,
        )
      } else {
        parent_branch_node = new BranchNode(
          current_node,
          from_h256(H256.zero()),
        )
      }

      if (parent_branch_node.left.is_zero() && parent_branch_node.right.is_zero()) {
        this.store.remove_branch(parent_branch_key);
      } else {
        this.store.insert_branch(parent_branch_key, parent_branch_node);
      }

      current_key = parent_branch_key.key;
      current_node = merge(height as u8, current_key, parent_branch_node.left, parent_branch_node.right);
    }
    this.root = current_node.hash();

    return this.root;
  }

  remove(key: H256): H256 {
    this.update(key, new H256(32));

    return this.root;
  }
}

export default SparseMerkleTree;