import SparseMerkleTree from '../src/tree';
import { assert } from 'chai';
import H256 from '../src/h256';
import blake2b, { Blake2b } from '@nervosnetwork/ckb-sdk-utils/lib/crypto/blake2b';
import { Hasher } from '../src';
import MerkleProof from '../src/merkle_proof';
import { IncorrectNumberOfLeaves } from '../src/errors/errors';
import { PERSONAL } from '../src/const';
import * as jsc from 'jsverify';
import { u8 } from '../src/u8';

class Blake2bHasher extends Hasher {
  hasher: Blake2b;

  constructor() {
    super();

    this.hasher = blake2b(32, null, null, PERSONAL);
  }

  update(h: H256): this {
    this.hasher.update(h);

    return this;
  }

  final(): H256 {
    return new H256(this.hasher.final('binary') as Uint8Array);
  }
}

describe('test sparse merkle tree', function () {
  it('default root', () => {
    let tree = new SparseMerkleTree(() => new Blake2bHasher);
    assert.equal(tree.store.branch_map.size, 0);
    assert.equal(tree.store.leaf_map.size, 0);
    assert.equal(tree.root.toString(), H256.zero().toString());

    tree.update(H256.zero(), H256.zero().fill(42));
    assert.notEqual(tree.root.toString(), H256.zero().toString())
    assert.notEqual(tree.store.branch_map.size, 0);
    assert.notEqual(tree.store.leaf_map.size, 0);

    tree.update(H256.zero(), H256.zero());
    assert.equal(tree.root.toString(), H256.zero().toString());
  });

  it('test merkle root', function () {
    let tree = new SparseMerkleTree(() => new Blake2bHasher);

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

  it('test default merkle proof', () => {
    let proof = new MerkleProof(() => new Blake2bHasher);
    assert.throw(() => {
      proof.compute_root([[new H256(32).fill(42), new H256(32).fill(42)]]);
    }, IncorrectNumberOfLeaves)
  })

  it('test zero value donot change root', () => {
    let tree = new SparseMerkleTree(() => new Blake2bHasher);
    let key = H256.zero();
    key[31] = 1;
    let value = H256.zero();
    tree.update(key, value);
    assert.equal(tree.root.toString(), H256.zero().toString());
    assert.equal(tree.store.leaf_map.size, 0);
    assert.equal(tree.store.branch_map.size, 0);
  })

  it('test zero value donot change store', () => {
    let tree = new SparseMerkleTree(() => new Blake2bHasher);
    let key = H256.zero();
    let value = H256.zero();
    value[31] = 1;
    tree.update(key, value);
    assert.notEqual(tree.root.toString(), H256.zero().toString());

    let root = tree.root;
    let store = tree.store.clone();

    key = H256.zero();
    key[31] = 1;
    value = H256.zero();
    tree.update(key, value);
    assert.equal(tree.root.toString(), root.toString());
    assert.equal(tree.store.leaf_map.values.toString(), store.leaf_map.values.toString());
    assert.equal(tree.store.branch_map.values.toString(), store.branch_map.values.toString());
  })

  it('test delete a leaf', () => {
    let tree = new SparseMerkleTree(() => new Blake2bHasher);
    let key = H256.zero();
    let value = H256.zero();
    value[31] = 1;
    tree.update(key, value);
    assert.notEqual(tree.root.toString(), H256.zero().toString());

    let root = new H256(tree.root);
    let store = tree.store.clone();

    key = H256.zero();
    key[31] = 1;
    value = H256.zero();
    value[31] = 1;

    tree.update(key, value);
    assert.notEqual(tree.root.toString(), root.toString());

    tree.update(key, H256.zero());
    assert.equal(tree.root.toString(), root.toString());
    assert.equal(tree.store.leaf_map.values.toString(), store.leaf_map.values.toString());
    assert.equal(tree.store.branch_map.values.toString(), store.branch_map.values.toString());
  })

  describe('test sibling key get', () => {
    it('get non exists sibling key should return zero value', () => {
      let tree = new SparseMerkleTree(() => new Blake2bHasher);
      let key = H256.zero();
      let value = H256.zero();
      value[0] = 1;
      tree.update(key, value);

      let sibling_key = H256.zero();
      sibling_key[0] = 1;

      assert.equal(H256.zero().toString(), tree.store.get_leaf(sibling_key).toString());
    });

    it('get sibling key should return corresponding value', () => {
      let tree = new SparseMerkleTree(() => new Blake2bHasher);
      let key = H256.zero();
      let value = H256.zero();
      value[0] = 1;
      tree.update(key, value);

      let sibling_key = H256.zero();
      sibling_key[0] = 1;
      let sibling_value = H256.zero();
      sibling_value[0] = 2;
      tree.update(sibling_key, sibling_value);

      assert.equal(value.toString(), tree.store.get_leaf(key).toString());
      assert.equal(sibling_value.toString(), tree.store.get_leaf(sibling_key).toString());
    })
  });

  jsc.property('insert same value to sibling key will construct a different root', jsc.nearray(jsc.uint8), jsc.nearray(jsc.uint8), (a, b) => {
    let tree1 = new SparseMerkleTree(() => new Blake2bHasher);
    let key = new H256(a);
    let value = new H256(b);
    tree1.update(key, value);

    let sibling_key = key;
    if (sibling_key.get_bit(0) == 1) {
      sibling_key.clear_bit(0);
    } else {
      sibling_key.set_bit(0);
    }

    let tree2 = new SparseMerkleTree(() => new Blake2bHasher);

    return tree1.getRoot.toString() != tree2.getRoot().toString();
  });

  jsc.property('test random update', jsc.nearray(jsc.uint8), jsc.nearray(jsc.uint8), (a, b) => {
    let tree = new SparseMerkleTree(() => new Blake2bHasher);
    let key = new H256(a);
    let value = new H256(b);
    tree.update(key, value);

    return tree.store.get_leaf(key).toString() == value.toString();
  });

  jsc.property('test random merkle proof', jsc.nearray(jsc.uint8), jsc.nearray(jsc.uint8), (a, b) => {
    let tree = new SparseMerkleTree(() => new Blake2bHasher);
    let key = new H256(a);
    let value = new H256(b);
    tree.update(key, value);

    let proof = tree.merkle_proof([key]);
    let compiled_proof = proof.clone().compile([[key, value]]);

    assert.isTrue(proof.branch_node.length < 1);
    assert.equal(proof.compute_root([[key, value]]).toString(), tree.getRoot().toString());
    assert.equal(tree.getRoot().toString(), compiled_proof.compute_root([[key, value]]).toString());

    return true;
  });

  jsc.property('test random update tree store', jsc.nearray(jsc.uint8), jsc.nearray(jsc.uint8), jsc.nearray(jsc.uint8), (a, b, c) => {
    let tree = new SparseMerkleTree(() => new Blake2bHasher);
    let key = new H256(a);
    let value1 = new H256(b);
    let value2 = new H256(c);

    tree.update(key, value1);
    assert.equal(tree.store.branch_map.size, 256);
    assert.equal(tree.store.leaf_map.size, 1);

    tree.update(key, value2);
    assert.equal(tree.store.branch_map.size, 256);
    assert.equal(tree.store.leaf_map.size, 1);
    assert.equal(tree.store.get_leaf(key).toString(), value2.toString());

    return true;
  })

  it('test replay to pass proof', () => {
    let key1 = new H256([
      1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0,
    ]);
    let key2 = new H256([
      2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0,
    ]);
    let key3 = new H256([
      3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0,
    ]);
    let key4 = new H256([
      4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0,
    ]);

    let existing = new H256([
      1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0,
    ]);

    let non_existing = new H256([
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0,
    ]);

    let other_value = new H256([
      0, 0, 0xff, 0, 0, 0, 0xff, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0xff,
    ]);

    let tree = new SparseMerkleTree(() => new Blake2bHasher);
    tree.update(key1, existing);
    tree.update(key2, non_existing);
    tree.update(key3, non_existing);
    tree.update(key4, non_existing);

    let proof = tree.merkle_proof([key3]);
    let compiled_proof = proof.clone().compile([[key3, non_existing]]);

    assert.equal(proof.clone().compute_root([[key3, non_existing]]).toString(), tree.getRoot().toString());
    assert.notEqual(proof.clone().compute_root([[key3, other_value]]).toString(), tree.getRoot().toString());
    assert.notEqual(proof.clone().compute_root([[key1, H256.zero()]]).toString(), tree.getRoot().toString());
    assert.notEqual(compiled_proof.compute_root([[key1, H256.zero()]]).toString(), tree.getRoot().toString());
  });

  jsc.property('test sibling leaf', jsc.nearray(jsc.uint8), jsc.nearray(jsc.uint8), jsc.nearray(jsc.uint8), (a, b, c) => {
    let key = new H256(a);
    let sibling_key = new H256(a);
    let value = new H256(b);
    let sibling_value = new H256(c);

    if (key.is_right(0)) {
      sibling_key.clear_bit(0);
    } else {
      sibling_key.set_bit(0);
    }

    let tree = new SparseMerkleTree(() => new Blake2bHasher);
    tree.update(key, value);
    tree.update(sibling_key, sibling_value);

    let proof = tree.merkle_proof([key, sibling_key]);
    proof.compute_root([[key, value], [sibling_key, sibling_value]])
    // console.log(key, sibling_key);
    // assert.equal(proof.compute_root([[key, value], [sibling_key, sibling_value]]).toString(), tree.getRoot().toString());

    return true;
  });
});