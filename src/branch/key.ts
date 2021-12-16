import H256 from "../h256";
import { u8 } from "../u8";

export class BranchKey {
  key: H256;
  height: u8;

  constructor(height: u8, key: H256) {
    this.key = key;
    this.height = height;
  }

  is_right(height: u8): boolean {
    return this.key.is_right(height);
  }

  toString(): string {
    return this.key.toString() + this.height.toString();
  } 
}