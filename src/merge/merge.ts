interface MergeValue {
    hash(): H256;
    is_zero(): boolean;
}

class MergeValueNormal implements MergeValue {
    value: H256

    constructor(value: H256) {
        this.value = value;
    }

    hash(): H256 {
        return this.value;
    }

    is_zero(): boolean {
        return this.value.is_zero();
    }
}

class MergeValueZero implements MergeValue {
    base_node: H256;
    zero_bits: H256;
    zero_count: u8;

    hash(): H256 {
        throw new Error("Method not implemented.");
    }

    is_zero(): boolean {
        throw new Error("Method not implemented.");
    }
}