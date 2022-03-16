import H256 from "./h256";
import { HasherFactoryMethod } from "./hasher";
import { MergeValue } from "./merge/merge";
import { u8 } from "./u8";
declare class MerkleProof {
    leaves_bitmap: Array<H256>;
    branch_node: Array<MergeValue>;
    hasherFactory: HasherFactoryMethod;
    constructor(hasherFactory: HasherFactoryMethod);
    clone(): MerkleProof;
    compute_root(leaves: Array<[H256, H256]>): H256;
    compile(leaves: Array<[H256, H256]>): CompiledMerkleProof;
}
declare class CompiledMerkleProof extends Array<u8> {
    private hasherFactory;
    constructor(hasherFactory: HasherFactoryMethod);
    compute_root(leaves: Array<[H256, H256]>): H256;
}
export default MerkleProof;
