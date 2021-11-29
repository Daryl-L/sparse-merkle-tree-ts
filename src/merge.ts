interface IMergeValue {
    hash(): H256;
    is_zero(): boolean;
}

abstract class MergeValue<H extends IHash> implements IMergeValue {
    abstract hash(): H256;
    abstract is_zero(): boolean;

    private hasher: H;

    static from_h256(v: H256) : IMergeValue {
        return new MergeValueNormal(v)
    }

    static merge<H extends IHash>(
        height: u8,
        node_key: H256,
        left: MergeValue<H>, 
        right: MergeValue<H>, 
        hasher: H
    ) : IMergeValue {
        hasher.update(new H256([height]));
        hasher.update(node_key);
        hasher.update(left.hash());
        hasher.update(right.hash())

        return MergeValue.from_h256(hasher.final());
    }
}

class MergeValueNormal<H extends IHash> extends MergeValue<H> {
    private value: H256

    constructor(value: H256) {
        super()

        this.value = value;
    }

    public hash(): H256 {
        return this.value;
    }

    public is_zero(): boolean {
        return this.value.is_zero();
    }
}

// class MergeValueZero extends MergeValue {
//     hash(): H256 {
//         throw new Error("Method not implemented.");
//     }
// }