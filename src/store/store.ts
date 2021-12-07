import { BranchKey } from "../branch/key";
import { BranchNode } from "../branch/node";
import { H256 } from "../h256";

export interface Store {
    branch_map: Map<string, BranchNode>;
    leaf_map: Map<string, H256>;
    insert_leaf(key: H256, value: H256): void;
    remove_leaf(key: H256): void;
    insert_branch(key: BranchKey, value: BranchNode): void;
    remove_branch(key: BranchKey): void;
    get_branch(key: BranchKey) : BranchNode;
    get_leaf(key: H256) : H256;
    clone(): Store;
}