import { u8 } from "./u8";
declare class H256 extends Uint8Array {
    static zero(): H256;
    equal(a: H256): boolean;
    is_zero(): boolean;
    is_right(height: u8): boolean;
    get_bit(height: u8): 0 | 1;
    clear_bit(height: u8): void;
    fork_height(next_key: H256): u8;
    set_bit(height: u8): void;
    to_array(): Array<u8>;
    parent_path(height: u8): H256;
}
export default H256;
