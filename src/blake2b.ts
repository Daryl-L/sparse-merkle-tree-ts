import Blake2b from "blake2b-wasm";

class Blake2bHasher implements IHash {
    private hasher: any;

    static default(): Blake2bHasher {
        let hasher = new Blake2bHasher();
        hasher.hasher = Blake2b(
            32, 
            new H256(0),
            new H256(16),
            (new TextEncoder()).encode("sparsemerkletree"),

        );

        return hasher;
    }

    update(val: H256) {
        this.hasher.hasher.update(val);
    }

    final(): H256 {
        return this.hasher.hasher.digest('binary');
    } 
}