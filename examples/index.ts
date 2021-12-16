import { Blake2b } from '@nervosnetwork/ckb-sdk-utils/lib/crypto/blake2b';
import { H256, Hasher, SparseMerkleTree } from '../lib'
import * as util from '@nervosnetwork/ckb-sdk-utils';

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