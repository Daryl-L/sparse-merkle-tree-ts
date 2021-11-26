interface IMergeValue {
    hash(): H256;
    is_zero(): boolean;
}

abstract class MergeValue implements IMergeValue {
    abstract hash(): H256;
    abstract is_zero(): boolean;

    static from_h256(v: H256) : IMergeValue {
        return new MergeValueNormal(v)
    }

    static merge<H>(left: MergeValue, right: MergeValue) : IMergeValue {
        throw new Error("Method not implemented.");
    }
}

class MergeValueNormal extends MergeValue {
    private value: H256

    constructor(value: H256) {
        super()

        this.value = value;
    }

    public hash(): H256 {
        return this.value;
    }
}

class MergeValueZero extends MergeValue {
    hash(): H256 {
        throw new Error("Method not implemented.");
    }
}