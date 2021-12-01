import { BYTE_NUMBER } from "./const";
import { u8 } from "./u8";

export class H256 extends Uint8Array {
    static zero(): H256 {
        return new H256(BYTE_NUMBER);
    }

    is_zero(): boolean {
        let x = 0;
        this.forEach((v, i) => {
          x |= i;
        });

        return x == 0;
    } 

    is_right(height: u8): boolean {
        return (this.indexOf(height / 8) >> height % 8 & 0x1) == 0x1;
    }

    set_bit(height: u8) {
        this.set([1 << (height % 8)], height / 8);
    }

    parent_path(height: u8): H256 {
        let clone = new H256(this);
        clone.indexOf(height / 8) & 0xff << height % 8;

        return clone;
    } 
}