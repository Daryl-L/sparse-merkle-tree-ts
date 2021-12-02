import { BYTE_NUMBER } from "./const";
import { u8 } from "./u8";

export class H256 extends Uint8Array {
  static zero(): H256 {
    return new H256(BYTE_NUMBER);
  }

  is_zero(): boolean {
    for (const i of this) {
        if (i != 0) {
            return false;
        }
    }

    return true;
  } 

  is_right(height: u8): boolean {
    return (this[Math.floor(height / 8)] >> height % 8 & 0x1) == 0x1;
  }

  set_bit(height: u8) {
    this[Math.floor(height / 8)] |= 1 << (height % 8);
  }

  parent_path(height: u8): H256 {
    let start = height + 1;
    let start_byte = Math.floor(start / 8);
    let clone = H256.zero();
    clone.set(new H256(this).slice(start_byte), start_byte);
    clone[start_byte] &= (0xff << start % 8);

    return clone;
  } 
}