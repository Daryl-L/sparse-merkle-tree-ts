import SparseMerkleTree from '../src/tree';
import expect, { assert } from 'chai';
import { H256 } from '../src/h256';

describe('default root', function() {
  let tree = new SparseMerkleTree();
  assert.equal(tree.store.branch_map.size, 0);
  assert.equal(tree.store.leaf_map.size, 0);
  assert.equal(tree.root.toString(), H256.zero().toString());

  tree.update(H256.zero(), H256.zero().fill(42));
  assert.notEqual(tree.root.toString(), H256.zero().toString(), 'actually is ' + tree.root);
  assert.notEqual(tree.store.branch_map.size, 0, 'actually is ' + tree.store.branch_map.size);
  assert.notEqual(tree.store.leaf_map.size, 0, 'actually is ' + tree.store.leaf_map.size);

  tree.update(H256.zero(), H256.zero());
  assert.equal(tree.root.toString(), H256.zero().toString());
})
