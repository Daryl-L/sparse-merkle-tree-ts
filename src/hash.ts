interface IHash {
    update(val: H256);
    final(): H256;
}