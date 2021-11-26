class H256 {
    value: number;

    constructor(value: number) {
        if (value >= 1 << 256 || value < 0) {
            throw Error('number of H256 should not be larger than max number of u32 or smaller than 0.');
        }
    }

    public is_zero() : boolean {
        return this.value == 0;
    } 

    public is_right(height : u8) : boolean {
        return (this.value >> (height * 8) & 1) != 0;
    }

    public parent_path(height: u8): H256 {
        return new H256(
            height << 9 & this.value
        );
    } 
}
