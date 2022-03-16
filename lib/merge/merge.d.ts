import H256 from "../h256";
import { HasherFactoryMethod } from "../hasher";
import { u8 } from "../u8";
export interface MergeValue {
    hash(): H256;
    is_zero(): boolean;
    clone(): MergeValue;
}
export declare class MergeValueNormal implements MergeValue {
    value: H256;
    constructor(value: H256);
    clone(): MergeValue;
    hash(): H256;
    is_zero(): boolean;
}
export declare class MergeValueWithZero implements MergeValue {
    base_node: H256;
    zero_bits: H256;
    zero_count: u8;
    hasherFactory: HasherFactoryMethod;
    constructor(hasherFactory: HasherFactoryMethod, base_node?: H256, zero_bits?: H256, zero_count?: u8);
    clone(): MergeValue;
    hash(): H256;
    is_zero(): boolean;
}
