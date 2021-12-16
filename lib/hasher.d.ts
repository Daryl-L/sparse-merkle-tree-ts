import { H256 } from ".";
export declare type HasherFactoryMethod = () => Hasher;
declare abstract class Hasher {
    abstract update(h: H256): Hasher;
    abstract final(): H256;
}
export default Hasher;
