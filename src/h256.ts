import { BYTE_NUMBER, MAX_HEIGHT } from "./const";
import { u8 } from "./u8";

class H256 extends Uint8Array {
  static zero(): H256 {
    return new H256(BYTE_NUMBER);
  }

  equal(a: H256): boolean {
    for (let i = 0; i < BYTE_NUMBER; i++) {
      if (this[i] != a[i]) {
        return false;
      }
    }

    return true;
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
    return this.get_bit(height) == 0x1;
  }

  get_bit(height: u8): 0 | 1 {
    return (this[Math.floor(height / 8)] >> height % 8 & 0x1) as 0 | 1;
  }

  clear_bit(height: u8) {
    this[Math.floor(height / 8)] &= ~(1 << (height % 8));
  }

  fork_height(next_key: H256): u8 {
    for (let height = MAX_HEIGHT; height >= 0; height--) {
      if (this.get_bit(height as u8) != next_key.get_bit(height as u8)) {
        return height as u8;
      }
    }

    return 0;
  }

  set_bit(height: u8) {
    this[Math.floor(height / 8)] |= 1 << (height % 8);
  }

  to_array(): Array<u8> {
    let arr = new Array;
    this.forEach((v) => {
      arr.push(v);
    });

    return arr;
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

export default H256;