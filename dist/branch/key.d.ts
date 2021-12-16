import { H256 } from "../h256";
import { u8 } from "../u8";
export declare class BranchKey {
    key: H256;
    height: u8;
    constructor(height: u8, key: H256);
    is_right(height: u8): boolean;
    toString(): string;
}
