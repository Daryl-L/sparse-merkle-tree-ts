import { BranchKey } from "./branch/key";
import { BYTE_NUMBER, MAX_HEIGHT } from "./const";
import { from_h256, merge } from "./merge/util";
import { Store } from "./store/store";
import { u8 } from "./u8";
import { H256 } from "./h256";
import { DefaultStore } from "./store/default_store";
import { BranchNode } from "./branch/node";
import MerkleProof from "./merkle_proof";

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

  /**
   * fork_height: the largest height of two leaf nodes' public parent nodes which are adjacent leaf nodes.
   * 
   * @param keys 
   * @returns 
   */
  merkle_proof(keys: Array<H256>): MerkleProof {
    if (keys == null || keys.length <= 0) {
      throw new Error('Empty keys.');
    }

    let proof = new MerkleProof;

    keys = keys.sort();

    keys.forEach((current_key) => {
      let bitmap = H256.zero();

      for (let height = 0; height < MAX_HEIGHT; height++) {
        let parent_branch_node = this.store.get_branch(
            new BranchKey(
              height as u8, 
              current_key.parent_path(height as u8),
          ),
        )

        let sibling = current_key.is_right(height as u8) ? parent_branch_node.left : parent_branch_node.right;

        if (!sibling.is_zero()) {
          bitmap.set_bit(height as u8);
        }
      }

      proof.leaves_bitmap.push(bitmap);
    })

    let fork_height_stack = new Array<u8>();
    let stack_top = 0;
    for (let i = 0; i < keys.length; i++) {
      let leaf_key = keys[i];
      let fork_height = i + 1 < keys.length ? leaf_key.fork_height(keys[i + 1]) : MAX_HEIGHT;

      for (let height = 0; height <= fork_height; height++) {
        if (height == fork_height && i < keys.length) {
          break;
        }

        if (stack_top > 0 && height == fork_height_stack[stack_top - 1]) {
          stack_top--;
        } else if (proof.leaves_bitmap[i].get_bit(height as u8) == 1) {
          let parent_branch_node = this.store.get_branch(
            new BranchKey(
              height as u8,
              leaf_key.parent_path(height as u8),
            ),
          );
            
          let sibling = leaf_key.is_right(height as u8) ? parent_branch_node.left : parent_branch_node.right;
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

export default SparseMerkleTree;