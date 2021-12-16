import H256 from "./h256";
import { MergeValue } from "./merge/merge";
import { u8 } from "./u8";
declare class MerkleProof {
    leaves_bitmap: Array<H256>;
    branch_node: Array<MergeValue>;
    constructor();
    compute_root(leaves: Array<[H256, H256]>): H256;
    compile(leaves: Array<[H256, H256]>): CompiledMerkleProof;
}
declare class CompiledMerkleProof extends Array<u8> {
    compute_root(leaves: Array<[H256, H256]>): H256;
}
export default MerkleProof;
