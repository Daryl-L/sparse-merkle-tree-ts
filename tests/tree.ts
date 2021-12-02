import SparseMerkleTree from '../src/tree';
import expect, { assert } from 'chai';
import { H256 } from '../src/h256';
import blake2b from '@nervosnetwork/ckb-sdk-utils/lib/crypto/blake2b';

describe('default root', function() {
  let tree = new SparseMerkleTree();
  assert.equal(tree.store.branch_map.size, 0);
  assert.equal(tree.store.leaf_map.size, 0);
  assert.equal(tree.root.toString(), H256.zero().toString());

  tree.update(H256.zero(), H256.zero().fill(42));
  assert.notEqual(tree.root.toString(), H256.zero().toString())
  assert.notEqual(tree.store.branch_map.size, 0);
  assert.notEqual(tree.store.leaf_map.size, 0);

  tree.update(H256.zero(), H256.zero());
  assert.equal(tree.root.toString(), H256.zero().toString());
})

describe('test merkle root', function () {
  let tree = new SparseMerkleTree();

  'The quick brown fox jumps over the lazy dog'.split(' ').forEach((v, i) => {
    let hasher = blake2b(32, null, null, new Uint8Array([83, 77, 84, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
    hasher.update(new Uint8Array([i, 0, 0, 0]));
    let key = new H256(hasher.final('binary') as Uint8Array);

    hasher = blake2b(32, null, null, new Uint8Array([83, 77, 84, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
    hasher.update(new TextEncoder().encode(v));
    let value = new H256(hasher.final('binary') as Uint8Array);

    tree.update(key, value);
  })

  let expected_root = new H256([
    209, 214, 1, 128, 166, 207, 49, 89, 206, 78, 169, 88, 18, 243, 130, 61, 150, 45, 43, 54,
    208, 20, 237, 20, 98, 69, 130, 120, 241, 169, 248, 211,
  ]);

  assert.equal(tree.store.leaf_map.size, 9);
  assert.equal(tree.root.toString(), expected_root.toString());
})