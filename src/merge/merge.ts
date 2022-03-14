import blake2b from "@nervosnetwork/ckb-sdk-utils/lib/crypto/blake2b";
import { PERSONAL } from '../const';
import H256 from "../h256";
import { HasherFactoryMethod } from "../hasher";
import { u8 } from "../u8";
import { MergeType } from './const';

export interface MergeValue {
    hash(): H256;
    is_zero(): boolean;
    clone(): MergeValue;
}

export class MergeValueNormal implements MergeValue {
    value: H256

    constructor(value: H256) {
        this.value = value;
    }

    clone(): MergeValue {
        return new MergeValueNormal(new H256(this.value.to_array()));
    }

    hash(): H256 {
        return this.value;
    }

    is_zero(): boolean {
        return this.value.is_zero();
    }
}

export class MergeValueWithZero implements MergeValue {
    base_node: H256;
    zero_bits: H256;
    zero_count: u8;
    hasherFactory: HasherFactoryMethod;

    constructor(hasherFactory: HasherFactoryMethod, base_node?: H256, zero_bits?: H256, zero_count?: u8) {
        this.base_node = base_node;
        this.zero_bits = zero_bits;
        this.zero_count = zero_count;
        this.hasherFactory = hasherFactory;
    }

    clone(): MergeValue {
        return new MergeValueWithZero(this.hasherFactory,
            new H256(this.base_node.to_array()),
            new H256(this.zero_bits.to_array()),
            this.zero_count,
        );
    }

    hash(): H256 {
        let hasher = this.hasherFactory();
        hasher.update(new H256([MergeType.MergeWithZero]));
        hasher.update(new H256(this.base_node));
        hasher.update(new H256(this.zero_bits));
        hasher.update(new H256([this.zero_count]));

        return new H256(hasher.final() as Uint8Array);
    }

    is_zero(): boolean {
        return false;
    }
}