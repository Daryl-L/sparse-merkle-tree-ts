import { BranchKey } from "../branch/key";
import { BranchNode } from "../branch/node";
import { Store } from "./store";
import { H256 } from "../h256";
export declare class DefaultStore implements Store {
    branch_map: Map<string, BranchNode>;
    leaf_map: Map<string, H256>;
    constructor();
    clone(): Store;
    insert_leaf(key: H256, value: H256): void;
    remove_leaf(key: H256): void;
    insert_branch(key: BranchKey, value: BranchNode): void;
    get_branch(key: BranchKey): BranchNode;
    get_leaf(key: H256): H256;
    remove_branch(key: BranchKey): void;
}
