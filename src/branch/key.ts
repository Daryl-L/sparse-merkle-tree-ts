export class BranchKey {
  key: H256;
  height: u8;

  constructor(height: u8, key: H256) {
    this.key = key;
    this.height = height;
  }

  public is_right(height: u8): boolean {
    return this.key.is_right(height);
  }
}