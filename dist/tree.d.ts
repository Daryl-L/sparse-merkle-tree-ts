import { Store } from "./store/store";
import { H256 } from "./h256";
import MerkleProof from "./merkle_proof";
declare class SparseMerkleTree {
    store: Store;
    root: H256;
    constructor();
    getRoot(): H256;
    update(key: H256, value: H256): H256;
    remove(key: H256): H256;
    merkle_proof(keys: Array<H256>): MerkleProof;
}
export default SparseMerkleTree;
