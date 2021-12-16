import blake2b from "@nervosnetwork/ckb-sdk-utils/lib/crypto/blake2b";
import { PERSONAL } from '../const';
import H256 from "../h256";
import { u8 } from "../u8";
import { MergeType } from './const';

export interface MergeValue {
    hash(): H256;
    is_zero(): boolean;
}

export class MergeValueNormal implements MergeValue {
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

export class MergeValueWithZero implements MergeValue {
    base_node: H256;
    zero_bits: H256;
    zero_count: u8;

    constructor(base_node?: H256, zero_bits?: H256, zero_count?: u8) {
        this.base_node = base_node;
        this.zero_bits = zero_bits;
        this.zero_count = zero_count;
    }

    hash(): H256 {
        let hasher = blake2b(32, null, null, PERSONAL);
        hasher.update(new H256([MergeType.MergeWithZero]));
        hasher.update(new H256(this.base_node));
        hasher.update(new H256(this.zero_bits));
        hasher.update(new H256([this.zero_count]));

        return new H256(hasher.final('binary') as Uint8Array);
    }

    is_zero(): boolean {
        return false;
    }
}