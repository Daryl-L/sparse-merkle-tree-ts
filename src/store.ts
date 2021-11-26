interface Store<V> {
    insert_leaf(key: H256, value: V);
    remove_leaf(key: H256);
    insert_branch(key: BranchKey, value: BranchNode);
    get_branch_key(key: H256) : BranchKey;
    get_branch_node(branch_key: BranchKey) : BranchNode;
}