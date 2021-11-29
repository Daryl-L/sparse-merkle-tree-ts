import Blake2b from "blake2b-wasm";

class BranchNode {
    left: IMergeValue;
    right: IMergeValue;

    constructor(left: IMergeValue, right: IMergeValue) {
        this.left = left;
        this.right = right;
    }
}

class BranchKey {
    key: H256;
    height: u8;

    constructor(height: u8, key: H256) {
        this.key = key;
        this.height = height;
    }

    public is_right(height: u8): boolean {
        return this.key.is_right(height);
    }
}

class SparseMerkleTree<H extends IHash, V extends H256, S extends Store<V>> {
    private store: S;
    private root: H256;


    /**
     * getRoot
     * 
     * @returns 
     */
    public getRoot() : H256 {
        return this.root;
    }

    /**
     * 
     * @param key 
     * @param value
     * 
     * @returns H256
     */
    public update(key : H256, value : V) : H256 {
        let node = MergeValue.from_h256(value);

        if (node.is_zero) {
            this.store.remove_leaf(key);
        } else {
            this.store.insert_leaf(key, value);
        }

        let current_key = key;
        let current_node = node;
        for (let height = 0; height < 256; height++) {
            let parent_branch_key = new BranchKey(
                height as u8, 
                current_key.parent_path(height as u8)
            );

            let parent_branch_node = this.store.get_branch_node(parent_branch_key);
            if (parent_branch_node != undefined) {
                if (current_key.is_right(height as u8)) {
                    parent_branch_node.left = node;
                } else {
                    parent_branch_node.right = node;
                }
            } else if (current_key.is_right(height as u8)) {

            } else {

            }

            this.store.insert_branch(parent_branch_key, parent_branch_node);

            current_key = parent_branch_key.key;
            current_node = MergeValue.merge<H>(height, current_key, parent_branch_node.left, parent_branch_node.right, new Blake2b());
        }

        return this.root;
    }
}