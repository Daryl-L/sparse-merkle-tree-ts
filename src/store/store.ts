import { BranchKey } from "../branch/key";
import { BranchNode } from "../branch/node";

export interface Store {
    insert_leaf(key: H256, value: H256);
    remove_leaf(key: H256);
    insert_branch(key: BranchKey, value: BranchNode);
    remove_branch(key: BranchKey);
    get_branch(key: BranchKey) : BranchNode;
    get_leaf(key: H256) : H256;
}