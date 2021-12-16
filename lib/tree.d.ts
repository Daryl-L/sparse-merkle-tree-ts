import { Store } from "./store/store";
import H256 from "./h256";
import MerkleProof from "./merkle_proof";
import Hasher from "./hasher";
declare class SparseMerkleTree<H> {
    store: Store;
    root: H256;
    hasherFactory: () => Hasher;
    constructor(hasherFactory: () => Hasher);
    getRoot(): H256;
    update(key: H256, value: H256): H256;
    remove(key: H256): H256;
    merkle_proof(keys: Array<H256>): MerkleProof;
}
export default SparseMerkleTree;
