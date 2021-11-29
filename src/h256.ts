class H256 extends Uint8Array {
    public is_zero() : boolean {
        return true;
    } 

    public is_right(height: u8): boolean {
        return (this.values[height / 8] >> height % 8 & 0x1) == 0x1;
    }

    public parent_path(height: u8): H256 {
        let clone = new H256(this);
        clone.values[height / 8] & 0xff << height % 8;

        return clone;
    } 
}
