import { Hash } from "crypto";
import { BranchNode } from "./branch/node";
import { MAX_HEIGHT } from "./const";
import { CorruptedProofError, CorruptedStackError, EmptyKeys, IncorrectNumberOfLeaves } from "./errors/errors";
import H256 from "./h256";
import { HasherFactoryMethod } from "./hasher";
import { MergeValue, MergeValueNormal, MergeValueWithZero } from "./merge/merge";
import { from_h256, merge } from "./merge/util";
import { u8 } from "./u8";

class MerkleProof {
  leaves_bitmap: Array<H256>;
  branch_node: Array<MergeValue>;
  hasherFactory: HasherFactoryMethod;

  constructor(hasherFactory: HasherFactoryMethod) {
    this.leaves_bitmap = new Array;
    this.branch_node = new Array;
    this.hasherFactory = hasherFactory;
  }

  clone(): MerkleProof {
    let cloned = new MerkleProof(this.hasherFactory);

    for (let v of this.leaves_bitmap) {
      cloned.leaves_bitmap.push(new H256(v.to_array()));
    }

    for (let v of this.branch_node) {
      cloned.branch_node.push(v.clone());
    }

    return cloned;
  }

  compute_root(leaves: Array<[H256, H256]>): H256 {
    return this.compile(leaves).compute_root(leaves);
  }

  compile(leaves: Array<[H256, H256]>): CompiledMerkleProof {
    if (leaves.length <= 0) {
      throw new EmptyKeys;
    } else if (leaves.length != this.leaves_bitmap.length) {
      throw new IncorrectNumberOfLeaves(leaves.length, this.leaves_bitmap.length)
    }

    leaves.sort();

    let proof = new CompiledMerkleProof(this.hasherFactory);
    let fork_height_stack = new Array<u8>(257);
    let stack_top = 0;
    let branch_node_index = 0;
    for (let i = 0; i < leaves.length; i++) {
      let leaf_key = leaves[0][0];
      let leaf_value = leaves[0][1];
      let fork_height = i + 1 < leaves.length ? leaf_key.fork_height(leaves[i + 1][0]) : MAX_HEIGHT;
      let op_code = 0;
      let op_data: Array<u8> = null;

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
        } else if (this.leaves_bitmap[i].get_bit(height as u8) == 1) {
          let sibling = this.branch_node[branch_node_index];
          branch_node_index++;
          if (sibling instanceof MergeValueNormal) {
            op_code = 0x50;
            op_data = sibling.hash().to_array();
          } else if (sibling instanceof MergeValueWithZero) {
            op_code = 0x51;
            op_data = new Array;
            op_data.push(sibling.zero_count);
            op_data.push(...sibling.base_node.to_array());
            op_data.push(...sibling.zero_bits.to_array());
          }
        } else {
          zero_count++;
          if (zero_count > 256) {
            throw new CorruptedProofError;
          }
        }

        if (op_code != 0) {
          if (zero_count > 0) {
            proof.push(0x4f);
            if (zero_count == 256) {
              proof.push(0);
            } else {
              proof.push(zero_count as u8);
            }
            zero_count = 0;
          }

          proof.push(op_code as u8);

          if (op_data != null) {
            proof.push(...op_data);
          }
        }
      }

      if (zero_count > 0) {
        proof.push(0x4f);
        if (zero_count == 256) {
          proof.push(0);
        } else {
          proof.push(zero_count as u8);
        }
      }

      fork_height_stack[stack_top] = fork_height;
      stack_top++;
    }

    return proof;
  }
}

class CompiledMerkleProof extends Array<u8> {
  private hasherFactory: HasherFactoryMethod;

  constructor(hasherFactory: HasherFactoryMethod) {
    super();
    this.hasherFactory = hasherFactory;
  }

  compute_root(leaves: Array<[H256, H256]>): H256 {
    let stack: Array<[number, H256, MergeValue]> = new Array;
    leaves.sort();
    let leaf_index = 0;
    let pc = 0;

    while (pc < this.length) {
      let code = this[pc++];
      let height: number, key: H256, value: MergeValue;
      let sibling: MergeValue, parent_key: H256, parent: MergeValue;
      let zero_count: u8;
      switch (code) {
        case 0x4c:
          if (leaf_index >= leaves.length) {
            throw new CorruptedStackError;
          }
          stack.push([0, leaves[leaf_index][0], from_h256(leaves[leaf_index][1])]);
          leaf_index++;
          break;
        case 0x50:
          if (stack.length == 0) {
            throw new CorruptedStackError;
          }

          if (pc + 32 > this.length) {
            throw new CorruptedStackError;
          }

          let data = new H256(this.slice(pc, pc += 32))
          sibling = from_h256(data);

          [height, key, value] = stack.pop();

          if (height > MAX_HEIGHT) {
            throw new CorruptedProofError;
          }

          parent_key = key.parent_path(height as u8);
          parent = ((): MergeValue => {
            if (key.is_right) {
              return merge(height as u8, parent_key, sibling, value, this.hasherFactory);
            } else {
              return merge(height as u8, parent_key, value, sibling, this.hasherFactory);
            }
          })()

          stack.push([height + 1, parent_key, parent]);
          break;
        case 0x51:
          if (stack.length == 0) {
            throw new CorruptedStackError;
          }

          if (pc + 65 > this.length) {
            throw new CorruptedStackError;
          }

          zero_count = this[pc++];
          let base_node = new H256(this.slice(pc, pc += 32));
          let zero_bits = new H256(this.slice(pc, pc += 32));

          [height, key, value] = stack.pop();

          if (height > MAX_HEIGHT) {
            throw new CorruptedProofError;
          }

          parent_key = key.parent_path(height as u8);
          sibling = new MergeValueWithZero(this.hasherFactory, base_node, zero_bits, zero_count);

          parent = ((): MergeValue => {
            if (key.is_right(height as u8)) {
              return merge(height as u8, parent_key, sibling, value, this.hasherFactory);
            } else {
              return merge(height as u8, parent_key, value, sibling, this.hasherFactory);
            }
          })()

          stack.push([height + 1, parent_key, parent]);
          break;
        case 0x48:
          if (stack.length < 2) {
            throw new CorruptedStackError;
          }

          let height_a: number, key_a: H256, value_a: MergeValue;
          let height_b: number, key_b: H256, value_b: MergeValue;

          [height_a, key_a, value_a] = stack.pop();
          [height_b, key_b, value_b] = stack.pop();

          if (height_a > MAX_HEIGHT || height_b > MAX_HEIGHT) {
            throw new CorruptedProofError;
          }

          parent_key = key_a.parent_path(height_a as u8);
          if (parent_key != key_b.parent_path(height_b as u8)) {
            throw new CorruptedProofError;
          }

          parent = ((): MergeValue => {
            if (key_a.is_right(height_a as u8)) {
              return merge(height_a as u8, parent_key, value_b, value_a, this.hasherFactory);
            } else {
              return merge(height_b as u8, parent_key, value_a, value_b, this.hasherFactory);
            }
          })()

          stack.push([height_a + 1, parent_key, parent])
          break;
        case 0x4f:
          if (stack.length == 0) {
            throw new CorruptedStackError;
          }

          if (pc >= this.length) {
            throw new CorruptedProofError
          }

          let n = this[pc] == 0 ? 256 : this[pc++];
          [height, key, value] = stack.pop();

          if (height > MAX_HEIGHT) {
            throw new CorruptedProofError;
          }

          for (let i = 0; i < n; i++) {
            if (height + i > MAX_HEIGHT) {
              throw new CorruptedProofError;
            }

            value = ((height: u8): MergeValue => {
              parent_key = key.parent_path(height);
              if (key.is_right(height as u8)) {
                return merge(height as u8, parent_key, new MergeValueNormal(H256.zero()), value, this.hasherFactory);
              } else {
                return merge(height as u8, parent_key, value, new MergeValueNormal(H256.zero()), this.hasherFactory);
              }
            })(height + i as u8);
          }

          stack.push([height + n, parent_key, value]);
      }
    }

    if (stack.length != 1) {
      throw new CorruptedStackError;
    }

    if (stack[0][0] != 256) {
      throw new CorruptedProofError;
    }

    if (leaf_index != leaves.length) {
      throw new CorruptedProofError;
    }

    return stack[0][2].hash();
  }
}

export default MerkleProof;