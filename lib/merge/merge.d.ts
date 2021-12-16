import H256 from "../h256";
import { u8 } from "../u8";
export interface MergeValue {
    hash(): H256;
    is_zero(): boolean;
}
export declare class MergeValueNormal implements MergeValue {
    value: H256;
    constructor(value: H256);
    hash(): H256;
    is_zero(): boolean;
}
export declare class MergeValueWithZero implements MergeValue {
    base_node: H256;
    zero_bits: H256;
    zero_count: u8;
    constructor(base_node?: H256, zero_bits?: H256, zero_count?: u8);
    hash(): H256;
    is_zero(): boolean;
}
