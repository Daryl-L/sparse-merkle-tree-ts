# Sparse Merkle Tree

An optimized Sparse Merkle Tree.

## Install

If you are using npm:

```
npm i sparse-merkle-tree-ts
```

If you are using yarn:

```
yarn add sparse-merkle-tree-ts
```

## Example

All branch nodes, branch keys and the leaf nodes are based on the `H256` class, which extends the `Uint8Array`.

```typescript
import { H256, SparseMerkleTree } from '../lib'

let auth_smt_value = H256.zero();
auth_smt_value[0] = 1;

let auth_smt_key = new H256([
  6, 18, 52, 86, 120, 144, 18, 52, 86, 120, 144, 18, 52, 86, 120, 144, 18, 52, 86, 120, 144, 
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
]);

let key_on_wl1 = new H256([
  111, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0,
]);

let key_on_wl2 = new H256([
  222, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0,
]);

let tree = new SparseMerkleTree;
tree.update(key_on_wl1, auth_smt_value);
tree.update(key_on_wl2, auth_smt_value);
tree.update(auth_smt_key, auth_smt_value);

let root = tree.root;

let proof = tree.merkle_proof([auth_smt_key]);
let compiled_proof = proof.compile([[auth_smt_key, auth_smt_value]]);

console.log('0x' + Array.from(root).map(x => x.toString(16).padStart(2, '0')).join(''));
console.log('0x' + compiled_proof.map(x => x.toString(16).padStart(2, '0')).join(''));
console.log('0x' + Array.from(compiled_proof.compute_root([[auth_smt_key, auth_smt_value]])).map(x => x.toString(16).padStart(2, '0')).join(''));
```

And you can see the output

```
0xa4a156cd3d51cbd19db9b9925186f499e5484dcfd9210f89aaf5a85d936c6032
0x4c4fa7519ff140d70605ba12fe535694399f37d59d586d4c25aaec63b47983d450974cbcee00000000000000000000000000000000000000000000000000000000000000004f58
0xa4a156cd3d51cbd19db9b9925186f499e5484dcfd9210f89aaf5a85d936c6032
```

To verify the given root, just use

```typescript
compiled_proof.compute_root([[auth_smt_key, auth_smt_value]]).toString() == root.toString();
```