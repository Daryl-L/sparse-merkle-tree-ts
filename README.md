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

For the hasher, you can use your own implementation, just implements the `Hasher`.

```typescript
import { Blake2b } from '@nervosnetwork/ckb-sdk-utils/lib/crypto/blake2b';
import { H256, Hasher, SparseMerkleTree } from '../lib'
import * as util from '@nervosnetwork/ckb-sdk-utils';

// your own implamentation of hasher.
class Blake2bHasher extends Hasher {
  hasher: Blake2b;

  constructor() {
    super();

    this.hasher = util.blake2b(32, null, null, new TextEncoder().encode('ckb-default-hash'));
  }

  update(h: H256): this {
    this.hasher.update(h);

    return this; 
  }

  final(): H256 {
    return new H256(this.hasher.final('binary') as Uint8Array);
  }
}

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


let tree = new SparseMerkleTree(() => new Blake2bHasher);
tree.update(key_on_wl1, auth_smt_value);
tree.update(key_on_wl2, auth_smt_value);
tree.update(auth_smt_key, auth_smt_value);

let root = tree.root;
console.log('0x' + Array.from(root).map(x => x.toString(16).padStart(2, '0')).join(''));

let proof = tree.merkle_proof([auth_smt_key]);
let compiled_proof = proof.compile([[auth_smt_key, auth_smt_value]]);
console.log('0x' + compiled_proof.map(x => x.toString(16).padStart(2, '0')).join(''));
console.log('0x' + Array.from(compiled_proof.compute_root([[auth_smt_key, auth_smt_value]])).map(x => x.toString(16).padStart(2, '0')).join(''));
```

And you can see the output

```
0x4cfe0f79bec46e9b111b6ed4a87a301a2058d63b1cbf9867b581a2cbfebf8c02
0x4c4fa7519f5613e03f3c0ed354d1491b0eb58705a091523f770bcecef276dd902d25d25e4100000000000000000000000000000000000000000000000000000000000000004f58
0x4cfe0f79bec46e9b111b6ed4a87a301a2058d63b1cbf9867b581a2cbfebf8c02
```

To verify the given root, just use

```typescript
compiled_proof.compute_root([[auth_smt_key, auth_smt_value]]).toString() == root.toString();
```