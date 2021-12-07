import SparseMerkleTree from '../src/tree';
import expect, { assert } from 'chai';
import { H256 } from '../src/h256';
import blake2b from '@nervosnetwork/ckb-sdk-utils/lib/crypto/blake2b';
import MerkleProof from '../src/merkle_proof';
import { IncorrectNumberOfLeaves } from '../src/errors/errors';

// describe('default root', function() {
//   let tree = new SparseMerkleTree();
//   assert.equal(tree.store.branch_map.size, 0);
//   assert.equal(tree.store.leaf_map.size, 0);
//   assert.equal(tree.root.toString(), H256.zero().toString());

//   tree.update(H256.zero(), H256.zero().fill(42));
//   assert.notEqual(tree.root.toString(), H256.zero().toString())
//   assert.notEqual(tree.store.branch_map.size, 0);
//   assert.notEqual(tree.store.leaf_map.size, 0);

//   tree.update(H256.zero(), H256.zero());
//   assert.equal(tree.root.toString(), H256.zero().toString());
// })

// describe('test merkle root', function () {
//   let tree = new SparseMerkleTree();

//   'The quick brown fox jumps over the lazy dog'.split(' ').forEach((v, i) => {
//     let hasher = blake2b(32, null, null, new Uint8Array([83, 77, 84, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
//     hasher.update(new Uint8Array([i, 0, 0, 0]));
//     let key = new H256(hasher.final('binary') as Uint8Array);

//     hasher = blake2b(32, null, null, new Uint8Array([83, 77, 84, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
//     hasher.update(new TextEncoder().encode(v));
//     let value = new H256(hasher.final('binary') as Uint8Array);

//     tree.update(key, value);
//   })

//   let expected_root = new H256([
//     209, 214, 1, 128, 166, 207, 49, 89, 206, 78, 169, 88, 18, 243, 130, 61, 150, 45, 43, 54,
//     208, 20, 237, 20, 98, 69, 130, 120, 241, 169, 248, 211,
//   ]);

//   assert.equal(tree.store.leaf_map.size, 9);
//   assert.equal(tree.root.toString(), expected_root.toString());
// })

// describe('test default merkle proof', () => {
//   let proof = new MerkleProof()
//   assert.throw(() => {
//     proof.compute_root([[new H256(32).fill(42), new H256(32).fill(42)]]);
//   }, IncorrectNumberOfLeaves)
// })

// describe('test zero value donot change root', () => {
//   let tree = new SparseMerkleTree;
//   let key = H256.zero();
//   key[31] = 1;
//   let value = H256.zero();
//   tree.update(key, value);
//   assert.equal(tree.root.toString(), H256.zero().toString());
//   assert.equal(tree.store.leaf_map.size, 0);
//   assert.equal(tree.store.branch_map.size, 0);
// })

// describe('test zero value donot change store', () => {
//   let tree = new SparseMerkleTree;
//   let key = H256.zero();
//   let value = H256.zero();
//   value[31] = 1;
//   tree.update(key, value);
//   assert.notEqual(tree.root.toString(), H256.zero().toString());

//   let root = tree.root;
//   let store = tree.store.clone();

//   key = H256.zero();
//   key[31] = 1;
//   value = H256.zero();
//   tree.update(key, value);
//   assert.equal(tree.root.toString(), root.toString());
//   assert.equal(tree.store.leaf_map.values.toString(), store.leaf_map.values.toString());
//   assert.equal(tree.store.branch_map.values.toString(), store.branch_map.values.toString());
// })

// describe('test delete a leaf', () => {
//   let tree = new SparseMerkleTree;
//   let key = H256.zero();
//   let value = H256.zero();
//   value[31] = 1;
//   tree.update(key, value);
//   assert.notEqual(tree.root.toString(), H256.zero().toString());

//   let root = new H256(tree.root);
//   let store = tree.store.clone();

//   key = H256.zero();
//   key[31] = 1;
//   value = H256.zero();
//   value[31] = 1;

//   tree.update(key, value);
//   assert.notEqual(tree.root.toString(), root.toString());

//   tree.update(key, H256.zero());
//   assert.equal(tree.root.toString(), root.toString());
//   assert.equal(tree.store.leaf_map.values.toString(), store.leaf_map.values.toString());
//   assert.equal(tree.store.branch_map.values.toString(), store.branch_map.values.toString());
// })

describe('test', () => {
  let key = new H256([123, 123, 160, 70, 172, 73, 233, 47, 58, 86, 26, 169, 7, 139, 141, 142, 194, 51, 53, 75, 133, 186, 80, 63, 243, 116, 158, 106, 254, 197, 98, 206]);
  let value = new H256([201, 85, 97, 153, 164, 37, 67, 210, 159, 179, 112, 200, 201, 122, 186, 137, 37, 197, 211, 174, 115, 175, 153, 57, 215, 28, 184, 238, 65, 234, 89, 247]);
  let tree= new SparseMerkleTree;
  tree.update(key, value);
  let proof = tree.merkle_proof(new Array<H256>(key));
  let compiled_proof = proof.compile(new Array<[H256, H256]>([key, value]))
  // assert.equal()
})